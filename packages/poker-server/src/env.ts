import 'dotenv/config'

function num(value: string | undefined, fallback: number): number {
    const n = Number(value)
    return Number.isFinite(n) ? n : fallback
}

export const env = {
    port: num(process.env.PORT, 4000),
    jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
    clientOrigins: (process.env.CLIENT_ORIGIN ?? 'http://localhost:5174')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    databasePath: process.env.DATABASE_PATH ?? './data/poker.db',
    startingChips: num(process.env.STARTING_CHIPS, 10000),
    turnSeconds: num(process.env.TURN_SECONDS, 30),
}

export type Env = typeof env
