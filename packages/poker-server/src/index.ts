import { createServer } from 'node:http'
import cors from 'cors'
import express from 'express'
import { Server } from 'socket.io'
import { env } from './env'
import { Database } from './db'
import { createApiRouter } from './routes'
import { attachSocket } from './socket'
import { TableManager } from './game/TableManager'
import type { AppServer } from './ioTypes'

const db = new Database(env.databaseUrl)

const app = express()
app.use(cors({ origin: env.clientOrigins, credentials: true }))
app.use(express.json())
app.get('/health', (_req, res) => {
    res.json({ ok: true })
})
app.use('/api', createApiRouter(db))

const httpServer = createServer(app)
const io: AppServer = new Server(httpServer, {
    cors: { origin: env.clientOrigins, credentials: true },
})

const manager = new TableManager(db, io, env.turnSeconds)
attachSocket(io, manager)

async function main() {
    await db.init()
    httpServer.listen(env.port, () => {
        console.log(`♠ poker-server listening on http://localhost:${env.port}`)
        console.log(`  allowed origins: ${env.clientOrigins.join(', ')}`)
    })
}

main().catch((err) => {
    console.error('failed to start poker-server:', err)
    process.exit(1)
})

function shutdown() {
    console.log('\nshutting down…')
    manager.dispose()
    io.close()
    void db.close()
    httpServer.close(() => process.exit(0))
    setTimeout(() => process.exit(0), 2000)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
