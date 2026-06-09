import { Router, type NextFunction, type Request, type Response } from 'express'
import type { AuthResponse, PublicUser } from '@ensnif/poker-engine'
import { AuthService, HttpError, toPublicUser, verifyToken } from './auth'
import type { Database } from './db'

export interface AuthedRequest extends Request {
    userId?: string
}

/** Express middleware that requires a valid Bearer token. */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
        res.status(401).json({ error: '로그인이 필요합니다' })
        return
    }
    try {
        const payload = verifyToken(header.slice('Bearer '.length))
        req.userId = payload.userId
        next()
    } catch {
        res.status(401).json({ error: '세션이 만료되었습니다. 다시 로그인해 주세요' })
    }
}

export function createApiRouter(db: Database): Router {
    const router = Router()
    const auth = new AuthService(db)

    const handle =
        (fn: (req: Request, res: Response) => Promise<void>) =>
        (req: Request, res: Response) => {
            fn(req, res).catch((err: unknown) => {
                if (err instanceof HttpError) {
                    res.status(err.status).json({ error: err.message })
                } else if (err instanceof Error && err.name === 'ZodError') {
                    res.status(400).json({ error: '입력값을 확인해 주세요' })
                } else if (err instanceof Error && /required|String|Number|expected/i.test(err.message)) {
                    res.status(400).json({ error: err.message })
                } else {
                    console.error(err)
                    res.status(500).json({ error: '서버 오류가 발생했습니다' })
                }
            })
        }

    router.post(
        '/auth/register',
        handle(async (req, res) => {
            const { username, password } = req.body ?? {}
            const result = await auth.register(String(username ?? ''), String(password ?? ''))
            res.json(result satisfies AuthResponse)
        }),
    )

    router.post(
        '/auth/login',
        handle(async (req, res) => {
            const { username, password } = req.body ?? {}
            const result = await auth.login(String(username ?? ''), String(password ?? ''))
            res.json(result satisfies AuthResponse)
        }),
    )

    router.get(
        '/me',
        requireAuth,
        handle(async (req: AuthedRequest, res) => {
            const row = await db.getUserById(req.userId!)
            if (!row) throw new HttpError(404, '사용자를 찾을 수 없습니다')
            // Prefer the live cached bankroll over the persisted value, which may
            // lag behind queued chip writes for a seated player.
            row.chips = await db.loadChips(row.id)
            res.json({ user: toPublicUser(row) satisfies PublicUser })
        }),
    )

    return router
}
