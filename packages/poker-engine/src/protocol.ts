import type { Card } from './cards'
import type { HandValue } from './evaluator'
import type { ActionType, LegalActions, Street } from './types'

/* ------------------------------------------------------------------ *
 *  REST / auth DTOs
 * ------------------------------------------------------------------ */

export interface PublicUser {
    id: string
    username: string
    /** Bankroll chips held outside of any table. */
    chips: number
    createdAt: number
}

export interface AuthRequest {
    username: string
    password: string
}

export interface AuthResponse {
    token: string
    user: PublicUser
}

/* ------------------------------------------------------------------ *
 *  Lobby
 * ------------------------------------------------------------------ */

export interface TableConfig {
    id: string
    name: string
    smallBlind: number
    bigBlind: number
    maxSeats: number
    minBuyIn: number
    maxBuyIn: number
}

export interface LobbyTable {
    id: string
    name: string
    smallBlind: number
    bigBlind: number
    maxSeats: number
    minBuyIn: number
    maxBuyIn: number
    seatedCount: number
    /** True when a hand is currently being played. */
    inHand: boolean
}

/* ------------------------------------------------------------------ *
 *  Sanitized table view (one per viewer; hides opponents' hole cards)
 * ------------------------------------------------------------------ */

export type SeatViewStatus =
    | 'empty'
    | 'waiting' // seated, will join the next hand
    | 'sittingOut'
    | 'active'
    | 'folded'
    | 'allIn'

/** A card the viewer is allowed to see, or null for a face-down card. */
export type VisibleCard = Card | null

export interface PublicSeat {
    seat: number
    playerId: string | null
    name: string | null
    /** Deterministic avatar color seed (hex) for the UI. */
    color: string | null
    stack: number
    committedThisStreet: number
    status: SeatViewStatus
    holeCards: VisibleCard[]
    cardCount: number
    isButton: boolean
    isActing: boolean
    isYou: boolean
    sittingOut: boolean
    /** When this seat must act by (epoch ms), for the turn timer. */
    actDeadline: number | null
    /** Set at showdown for revealed hands. */
    handLabel: string | null
}

export interface PublicPot {
    amount: number
    eligible: number[]
}

export interface HandResultSummary {
    wonByFold: boolean
    winners: { seat: number; playerId: string; name: string; amount: number; handLabel: string | null }[]
    board: Card[]
}

export interface PublicTableState {
    tableId: string
    name: string
    config: TableConfig
    /** 'waiting' when there is no active hand. */
    phase: Street | 'waiting'
    handId: string | null
    board: Card[]
    pots: PublicPot[]
    totalPot: number
    seats: PublicSeat[]
    button: number | null
    actingSeat: number | null
    betToCall: number
    /** Your seat number, or null if you are only observing. */
    yourSeat: number | null
    /** Legal actions for you when it is your turn, else null. */
    yourLegalActions: LegalActions | null
    /** Most recent finished hand, for result overlays. */
    lastResult: HandResultSummary | null
}

/* ------------------------------------------------------------------ *
 *  Game log + chat (for animation cues and history)
 * ------------------------------------------------------------------ */

export interface GameLogEntry {
    id: string
    ts: number
    kind: 'hand' | 'blind' | 'action' | 'street' | 'showdown' | 'result' | 'system'
    text: string
    seat?: number
    action?: ActionType
    amount?: number
}

export interface ChatMessage {
    playerId: string
    name: string
    message: string
    ts: number
}

/* ------------------------------------------------------------------ *
 *  Socket request payloads + acks
 * ------------------------------------------------------------------ */

export interface JoinTableRequest {
    tableId: string
    buyIn: number
    /** Preferred seat; the server picks the first open seat when omitted. */
    seat?: number
}

export interface PlayerActionRequest {
    type: ActionType
    /** Raise-to total for bet/raise. */
    amount?: number
}

export interface AckResponse {
    ok: boolean
    error?: string
}

/* ------------------------------------------------------------------ *
 *  Typed Socket.IO event maps (shared by client and server)
 * ------------------------------------------------------------------ */

export interface ServerToClientEvents {
    'lobby:tables': (tables: LobbyTable[]) => void
    'table:state': (state: PublicTableState) => void
    'table:log': (entry: GameLogEntry) => void
    'table:error': (err: { message: string }) => void
    'chat:message': (msg: ChatMessage) => void
}

export interface ClientToServerEvents {
    'lobby:subscribe': () => void
    'lobby:unsubscribe': () => void
    'table:join': (req: JoinTableRequest, ack: (res: AckResponse) => void) => void
    'table:leave': (ack?: (res: AckResponse) => void) => void
    'table:sitOut': (req: { sitOut: boolean }) => void
    'table:rebuy': (req: { amount: number }, ack?: (res: AckResponse) => void) => void
    'player:action': (req: PlayerActionRequest, ack?: (res: AckResponse) => void) => void
    'chat:send': (req: { message: string }) => void
}

/** Data attached to an authenticated socket (server-side). */
export interface SocketData {
    userId: string
    username: string
}

export type { HandValue }
