import pg from 'pg'
import { nanoid } from 'nanoid'

const { Pool, types } = pg

// BIGINT (oid 20) → JS number. Chip counts and epoch-ms timestamps stay well
// within Number.MAX_SAFE_INTEGER, so this is safe and saves callers parsing.
types.setTypeParser(20, (v) => parseInt(v, 10))

export interface UserRow {
    id: string
    username: string
    username_lower: string
    password_hash: string
    chips: number
    created_at: number
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
    id             TEXT PRIMARY KEY,
    username       TEXT NOT NULL,
    username_lower TEXT NOT NULL UNIQUE,
    password_hash  TEXT NOT NULL,
    chips          BIGINT NOT NULL,
    created_at     BIGINT NOT NULL
);
CREATE TABLE IF NOT EXISTS ledger (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL,
    delta         BIGINT NOT NULL,
    reason        TEXT NOT NULL,
    balance_after BIGINT NOT NULL,
    created_at    BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ledger_user ON ledger (user_id);
`

function needsSsl(url: string): boolean {
    if (/\bsslmode=disable\b/.test(url)) return false
    if (/\bsslmode=require\b/.test(url)) return true
    // Managed Postgres (Neon, Supabase, Render, RDS) terminates TLS; local does not.
    return !/@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(url)
}

/**
 * Persistence over Postgres with a synchronous in-memory chip cache.
 *
 * The realtime game loop reads and writes chips synchronously (inside timers
 * and hand-completion callbacks), but Postgres is async. To avoid threading
 * `await` through that game code, the authoritative bankroll for any *active*
 * user is held in {@link chipCache} and mutated synchronously; every mutation
 * is flushed to Postgres on a per-user serialized queue so the `ledger` stays
 * append-only and ordered.
 *
 * Callers MUST `await loadChips(userId)` before the first synchronous
 * `getChips`/`adjustChips` for that user — the socket `table:join` handler does
 * this before seating.
 */
export class Database {
    private pool: pg.Pool
    private chipCache = new Map<string, number>()
    private writeChains = new Map<string, Promise<void>>()

    constructor(connectionString: string) {
        this.pool = new Pool({
            connectionString,
            ssl: needsSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
            max: 10,
        })
    }

    /** Create tables/indexes if missing. Call once before serving. */
    async init(): Promise<void> {
        await this.pool.query(SCHEMA)
    }

    async createUser(username: string, passwordHash: string, chips: number, now: number): Promise<UserRow> {
        const id = nanoid()
        const client = await this.pool.connect()
        try {
            await client.query('BEGIN')
            await client.query(
                `INSERT INTO users (id, username, username_lower, password_hash, chips, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [id, username, username.toLowerCase(), passwordHash, chips, now],
            )
            await client.query(
                `INSERT INTO ledger (id, user_id, delta, reason, balance_after, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [nanoid(), id, chips, 'signup', chips, now],
            )
            await client.query('COMMIT')
        } catch (err) {
            await client.query('ROLLBACK')
            throw err
        } finally {
            client.release()
        }
        this.chipCache.set(id, chips)
        return { id, username, username_lower: username.toLowerCase(), password_hash: passwordHash, chips, created_at: now }
    }

    async getUserById(id: string): Promise<UserRow | undefined> {
        const { rows } = await this.pool.query<UserRow>('SELECT * FROM users WHERE id = $1', [id])
        return rows[0]
    }

    async getUserByUsername(username: string): Promise<UserRow | undefined> {
        const { rows } = await this.pool.query<UserRow>('SELECT * FROM users WHERE username_lower = $1', [
            username.toLowerCase(),
        ])
        return rows[0]
    }

    /** Warm the in-memory bankroll for a user. Idempotent; returns the balance. */
    async loadChips(userId: string): Promise<number> {
        const cached = this.chipCache.get(userId)
        if (cached !== undefined) return cached
        const { rows } = await this.pool.query<{ chips: number }>('SELECT chips FROM users WHERE id = $1', [userId])
        const chips = rows[0]?.chips ?? 0
        // Don't clobber a value that another call may have just loaded/mutated.
        const existing = this.chipCache.get(userId)
        if (existing !== undefined) return existing
        this.chipCache.set(userId, chips)
        return chips
    }

    /** Current bankroll from the cache, or 0 if not loaded. */
    getChips(userId: string): number {
        return this.chipCache.get(userId) ?? 0
    }

    /**
     * Atomically applies a chip delta against the cached balance and queues a
     * durable write. Synchronous: throws (without mutating) if the balance is
     * not loaded or would go negative. Returns the new balance.
     */
    adjustChips(userId: string, delta: number, reason: string): number {
        const current = this.chipCache.get(userId)
        if (current === undefined) {
            throw new Error(`chips not loaded for user ${userId}; call loadChips() first`)
        }
        const next = current + delta
        if (next < 0) throw new Error('Insufficient chips')
        this.chipCache.set(userId, next)
        this.enqueueWrite(userId, delta, reason, next, Date.now())
        return next
    }

    /** Per-user serialized persistence so the ledger order matches the cache. */
    private enqueueWrite(userId: string, delta: number, reason: string, balanceAfter: number, now: number): void {
        const prev = this.writeChains.get(userId) ?? Promise.resolve()
        const next = prev
            .catch(() => {})
            .then(() => this.persist(userId, delta, reason, balanceAfter, now))
            .catch((err) => {
                console.error(`[db] failed to persist chip change for ${userId}:`, err)
            })
        this.writeChains.set(userId, next)
    }

    private async persist(
        userId: string,
        delta: number,
        reason: string,
        balanceAfter: number,
        now: number,
    ): Promise<void> {
        const client = await this.pool.connect()
        try {
            await client.query('BEGIN')
            await client.query('UPDATE users SET chips = $1 WHERE id = $2', [balanceAfter, userId])
            await client.query(
                `INSERT INTO ledger (id, user_id, delta, reason, balance_after, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [nanoid(), userId, delta, reason, balanceAfter, now],
            )
            await client.query('COMMIT')
        } catch (err) {
            await client.query('ROLLBACK')
            throw err
        } finally {
            client.release()
        }
    }

    /** Wait for all queued chip writes to flush, then close the pool. */
    async close(): Promise<void> {
        await Promise.allSettled([...this.writeChains.values()])
        await this.pool.end()
    }
}
