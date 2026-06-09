import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import type { PublicUser } from '@ensnif/poker-engine'
import { env } from './env'
import type { Database, UserRow } from './db'

export const credentialsSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, '아이디는 3자 이상이어야 합니다')
        .max(20, '아이디는 20자 이하여야 합니다')
        .regex(/^[a-zA-Z0-9_가-힣]+$/, '아이디는 한글/영문/숫자/밑줄만 사용할 수 있습니다'),
    password: z.string().min(4, '비밀번호는 4자 이상이어야 합니다').max(100),
})

export interface TokenPayload {
    userId: string
    username: string
}

export function toPublicUser(row: UserRow): PublicUser {
    return { id: row.id, username: row.username, chips: row.chips, createdAt: row.created_at }
}

export function signToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.jwtSecret)
    if (typeof decoded === 'string' || !decoded || typeof decoded.userId !== 'string') {
        throw new Error('Invalid token')
    }
    return { userId: decoded.userId as string, username: decoded.username as string }
}

export class AuthService {
    constructor(private db: Database) {}

    async register(rawUsername: string, password: string): Promise<{ token: string; user: PublicUser }> {
        const { username, password: pw } = credentialsSchema.parse({ username: rawUsername, password })
        if (await this.db.getUserByUsername(username)) {
            throw new HttpError(409, '이미 사용 중인 아이디입니다')
        }
        const hash = await bcrypt.hash(pw, 10)
        const row = await this.db.createUser(username, hash, env.startingChips, Date.now())
        return { token: signToken({ userId: row.id, username: row.username }), user: toPublicUser(row) }
    }

    async login(rawUsername: string, password: string): Promise<{ token: string; user: PublicUser }> {
        const parsed = credentialsSchema.safeParse({ username: rawUsername, password })
        // Use a generic error on login to avoid leaking which field was wrong.
        const username = parsed.success ? parsed.data.username : rawUsername.trim()
        const row = await this.db.getUserByUsername(username)
        if (!row || !(await bcrypt.compare(password, row.password_hash))) {
            throw new HttpError(401, '아이디 또는 비밀번호가 올바르지 않습니다')
        }
        return { token: signToken({ userId: row.id, username: row.username }), user: toPublicUser(row) }
    }
}

export class HttpError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message)
    }
}
