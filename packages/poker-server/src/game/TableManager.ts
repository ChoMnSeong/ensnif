import type { LobbyTable } from '@ensnif/poker-engine'
import type { Database } from '../db'
import type { AppServer } from '../ioTypes'
import { TABLE_CONFIGS } from '../tables'
import { Table } from './Table'

const LOBBY_ROOM = 'lobby'

/** Owns every live {@link Table} and the lobby projection. */
export class TableManager {
    private tables = new Map<string, Table>()

    constructor(
        private db: Database,
        private io: AppServer,
        turnSeconds: number,
    ) {
        for (const config of TABLE_CONFIGS) {
            this.tables.set(
                config.id,
                new Table(config, {
                    adjustChips: (userId, delta, reason) => db.adjustChips(userId, delta, reason),
                    getChips: (userId) => db.getChips(userId),
                    turnSeconds,
                    onLobbyChanged: () => this.broadcastLobby(),
                }),
            )
        }
    }

    get(id: string): Table | undefined {
        return this.tables.get(id)
    }

    /** Warm a user's bankroll cache before they take a synchronous chip action. */
    ensureChipsLoaded(userId: string): Promise<number> {
        return this.db.loadChips(userId)
    }

    /** The table where this user is currently seated, if any. */
    findTableOfUser(userId: string): Table | undefined {
        for (const table of this.tables.values()) if (table.isSeated(userId)) return table
        return undefined
    }

    lobby(): LobbyTable[] {
        return [...this.tables.values()].map((t) => t.lobbyInfo())
    }

    broadcastLobby(): void {
        this.io.to(LOBBY_ROOM).emit('lobby:tables', this.lobby())
    }

    dispose(): void {
        for (const table of this.tables.values()) table.dispose()
    }
}

export { LOBBY_ROOM }
