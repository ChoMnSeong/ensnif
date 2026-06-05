import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { nanoid } from 'nanoid'

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
    chips          INTEGER NOT NULL,
    created_at     INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS ledger (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL,
    delta         INTEGER NOT NULL,
    reason        TEXT NOT NULL,
    balance_after INTEGER NOT NULL,
    created_at    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ledger_user ON ledger (user_id);
`

/**
 * Thin synchronous persistence layer over Node's built-in SQLite.
 * Chip movements always run inside a transaction and append to the ledger so
 * the bankroll is auditable and never goes negative.
 */
export class Database {
    private db: DatabaseSync

    constructor(path: string) {
        if (path !== ':memory:') {
            mkdirSync(dirname(path), { recursive: true })
        }
        this.db = new DatabaseSync(path)
        this.db.exec('PRAGMA journal_mode = WAL;')
        this.db.exec(SCHEMA)
    }

    createUser(username: string, passwordHash: string, chips: number, now: number): UserRow {
        const id = nanoid()
        this.db
            .prepare(
                `INSERT INTO users (id, username, username_lower, password_hash, chips, created_at)
                 VALUES (?, ?, ?, ?, ?, ?)`,
            )
            .run(id, username, username.toLowerCase(), passwordHash, chips, now)
        this.db
            .prepare(
                `INSERT INTO ledger (id, user_id, delta, reason, balance_after, created_at)
                 VALUES (?, ?, ?, ?, ?, ?)`,
            )
            .run(nanoid(), id, chips, 'signup', chips, now)
        return this.getUserById(id)!
    }

    getUserById(id: string): UserRow | undefined {
        return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined
    }

    getUserByUsername(username: string): UserRow | undefined {
        return this.db.prepare('SELECT * FROM users WHERE username_lower = ?').get(username.toLowerCase()) as
            | UserRow
            | undefined
    }

    /**
     * Atomically applies a chip delta and records it in the ledger.
     * Throws if the balance would go negative. Returns the new balance.
     */
    adjustChips(userId: string, delta: number, reason: string, now: number): number {
        this.db.exec('BEGIN')
        try {
            const row = this.getUserById(userId)
            if (!row) throw new Error('User not found')
            const next = row.chips + delta
            if (next < 0) throw new Error('Insufficient chips')
            this.db.prepare('UPDATE users SET chips = ? WHERE id = ?').run(next, userId)
            this.db
                .prepare(
                    `INSERT INTO ledger (id, user_id, delta, reason, balance_after, created_at)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                )
                .run(nanoid(), userId, delta, reason, next, now)
            this.db.exec('COMMIT')
            return next
        } catch (err) {
            this.db.exec('ROLLBACK')
            throw err
        }
    }

    getChips(userId: string): number {
        return this.getUserById(userId)?.chips ?? 0
    }
}
