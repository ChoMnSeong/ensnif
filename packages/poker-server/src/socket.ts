import type { AckResponse } from '@ensnif/poker-engine'
import { verifyToken } from './auth'
import type { AppServer, AppSocket } from './ioTypes'
import { LOBBY_ROOM, TableManager } from './game/TableManager'

function errMessage(err: unknown): string {
    return err instanceof Error ? err.message : '요청을 처리할 수 없습니다'
}

/** Wires authenticated sockets to the lobby and table game logic. */
export function attachSocket(io: AppServer, manager: TableManager): void {
    // Authenticate every socket from the JWT in the handshake.
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token as string | undefined
        if (!token) return next(new Error('unauthorized'))
        try {
            const payload = verifyToken(token)
            socket.data.userId = payload.userId
            socket.data.username = payload.username
            next()
        } catch {
            next(new Error('unauthorized'))
        }
    })

    io.on('connection', (socket: AppSocket) => {
        const userId = socket.data.userId
        const username = socket.data.username

        // Reconnect: if already seated somewhere, re-attach this socket.
        manager.findTableOfUser(userId)?.reattach(socket, userId)

        socket.on('lobby:subscribe', () => {
            void socket.join(LOBBY_ROOM)
            socket.emit('lobby:tables', manager.lobby())
        })

        socket.on('lobby:unsubscribe', () => {
            void socket.leave(LOBBY_ROOM)
        })

        socket.on('table:join', async (req, ack: (res: AckResponse) => void) => {
            const table = manager.get(req.tableId)
            if (!table) return ack?.({ ok: false, error: '테이블을 찾을 수 없습니다' })
            const other = manager.findTableOfUser(userId)
            if (other && other.config.id !== req.tableId) {
                return ack?.({ ok: false, error: '이미 다른 테이블에 앉아 있습니다' })
            }
            try {
                // Warm the bankroll cache so the synchronous buy-in below is safe.
                await manager.ensureChipsLoaded(userId)
                table.join(socket, userId, username, req.buyIn, req.seat)
                ack?.({ ok: true })
            } catch (err) {
                ack?.({ ok: false, error: errMessage(err) })
            }
        })

        socket.on('table:leave', (ack) => {
            manager.findTableOfUser(userId)?.leave(userId, 'leave')
            ack?.({ ok: true })
        })

        socket.on('table:sitOut', ({ sitOut }) => {
            manager.findTableOfUser(userId)?.setSitOut(userId, sitOut)
        })

        socket.on('table:rebuy', ({ amount }, ack) => {
            const table = manager.findTableOfUser(userId)
            if (!table) return ack?.({ ok: false, error: '테이블에 앉아 있지 않습니다' })
            try {
                table.rebuy(userId, amount)
                ack?.({ ok: true })
            } catch (err) {
                ack?.({ ok: false, error: errMessage(err) })
            }
        })

        socket.on('player:action', (req, ack) => {
            const table = manager.findTableOfUser(userId)
            if (!table) return ack?.({ ok: false, error: '테이블에 없습니다' })
            table.handleAction(userId, req)
            ack?.({ ok: true })
        })

        socket.on('chat:send', ({ message }) => {
            const table = manager.findTableOfUser(userId)
            if (!table) return
            const text = String(message ?? '')
                .slice(0, 200)
                .trim()
            if (text) table.chat(userId, username, text)
        })

        socket.on('disconnect', () => {
            manager.findTableOfUser(userId)?.handleDisconnect(userId)
        })
    })
}
