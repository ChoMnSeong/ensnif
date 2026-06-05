import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react'
import { io, type Socket } from 'socket.io-client'
import type {
    ChatMessage,
    ClientToServerEvents,
    GameLogEntry,
    LobbyTable,
    PlayerActionRequest,
    PublicTableState,
    ServerToClientEvents,
} from '@ensnif/poker-engine'
import { useAuth } from './auth'

export type AppClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>

const SocketContext = createContext<AppClientSocket | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
    const { token } = useAuth()
    const [socket, setSocket] = useState<AppClientSocket | null>(null)

    useEffect(() => {
        if (!token) {
            setSocket(null)
            return
        }
        const url = import.meta.env.VITE_SOCKET_URL || undefined
        const s: AppClientSocket = io(url, {
            auth: { token },
            transports: ['websocket', 'polling'],
        })
        setSocket(s)
        return () => {
            s.close()
        }
    }, [token])

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export function useSocket(): AppClientSocket | null {
    return useContext(SocketContext)
}

/** Subscribes to the lobby table list. */
export function useLobby(): LobbyTable[] {
    const socket = useSocket()
    const [tables, setTables] = useState<LobbyTable[]>([])
    useEffect(() => {
        if (!socket) return
        const onTables = (t: LobbyTable[]) => setTables(t)
        socket.on('lobby:tables', onTables)
        socket.emit('lobby:subscribe')
        return () => {
            socket.emit('lobby:unsubscribe')
            socket.off('lobby:tables', onTables)
        }
    }, [socket])
    return tables
}

export interface TableController {
    state: PublicTableState | null
    log: GameLogEntry[]
    chat: ChatMessage[]
    error: string | null
    clearError(): void
    join(tableId: string, buyIn: number, seat?: number): Promise<void>
    leave(): void
    sitOut(sitOut: boolean): void
    rebuy(amount: number): Promise<void>
    act(action: PlayerActionRequest): void
    sendChat(message: string): void
}

/** Subscribes to live table state/log/chat and exposes player actions. */
export function useTable(): TableController {
    const socket = useSocket()
    const [state, setState] = useState<PublicTableState | null>(null)
    const [log, setLog] = useState<GameLogEntry[]>([])
    const [chat, setChat] = useState<ChatMessage[]>([])
    const [error, setError] = useState<string | null>(null)
    const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const flashError = useCallback((message: string) => {
        setError(message)
        if (errorTimer.current) clearTimeout(errorTimer.current)
        errorTimer.current = setTimeout(() => setError(null), 4000)
    }, [])

    useEffect(() => {
        if (!socket) return
        const onState = (s: PublicTableState) => setState(s)
        const onLog = (e: GameLogEntry) => setLog((prev) => [...prev.slice(-120), e])
        const onChat = (m: ChatMessage) => setChat((prev) => [...prev.slice(-120), m])
        const onError = (e: { message: string }) => flashError(e.message)
        socket.on('table:state', onState)
        socket.on('table:log', onLog)
        socket.on('chat:message', onChat)
        socket.on('table:error', onError)
        return () => {
            socket.off('table:state', onState)
            socket.off('table:log', onLog)
            socket.off('chat:message', onChat)
            socket.off('table:error', onError)
        }
    }, [socket, flashError])

    const join = useCallback(
        (tableId: string, buyIn: number, seat?: number) =>
            new Promise<void>((resolve, reject) => {
                if (!socket) return reject(new Error('연결되지 않았습니다'))
                socket.emit('table:join', { tableId, buyIn, seat }, (res) => {
                    if (res.ok) resolve()
                    else reject(new Error(res.error ?? '입장에 실패했습니다'))
                })
            }),
        [socket],
    )

    const rebuy = useCallback(
        (amount: number) =>
            new Promise<void>((resolve, reject) => {
                if (!socket) return reject(new Error('연결되지 않았습니다'))
                socket.emit('table:rebuy', { amount }, (res) => {
                    if (res?.ok) resolve()
                    else reject(new Error(res?.error ?? '리바이에 실패했습니다'))
                })
            }),
        [socket],
    )

    const leave = useCallback(() => {
        socket?.emit('table:leave')
        setState(null)
        setLog([])
    }, [socket])

    const sitOut = useCallback((v: boolean) => socket?.emit('table:sitOut', { sitOut: v }), [socket])
    const act = useCallback((action: PlayerActionRequest) => socket?.emit('player:action', action), [socket])
    const sendChat = useCallback((message: string) => socket?.emit('chat:send', { message }), [socket])
    const clearError = useCallback(() => setError(null), [])

    return useMemo(
        () => ({ state, log, chat, error, clearError, join, leave, sitOut, rebuy, act, sendChat }),
        [state, log, chat, error, clearError, join, leave, sitOut, rebuy, act, sendChat],
    )
}
