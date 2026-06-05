import type { Server, Socket } from 'socket.io'
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from '@ensnif/poker-engine'

type NoServerEvents = Record<string, never>

export type AppServer = Server<ClientToServerEvents, ServerToClientEvents, NoServerEvents, SocketData>
export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, NoServerEvents, SocketData>
