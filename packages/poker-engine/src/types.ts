import type { Card } from './cards'
import type { HandValue } from './evaluator'

/** Betting streets, plus terminal `complete`. */
export type Street = 'preflop' | 'flop' | 'turn' | 'river' | 'showdown' | 'complete'

export type SeatStatus = 'active' | 'folded' | 'allIn'

/** A participant as handed to {@link createHand}. */
export interface HandPlayer {
    seat: number
    playerId: string
    name: string
    stack: number
}

export interface HandConfig {
    smallBlind: number
    bigBlind: number
    /** Optional per-player ante posted before the hand. Defaults to 0. */
    ante?: number
}

/** Per-seat state for a single hand. */
export interface HandSeat {
    seat: number
    playerId: string
    name: string
    startingStack: number
    stack: number
    /** Chips committed in the current betting round. */
    committedThisStreet: number
    /** Total chips committed across the whole hand (used for side pots). */
    totalCommitted: number
    holeCards: Card[]
    status: SeatStatus
    /** Whether this seat has acted since the last aggressive action this street. */
    hasActed: boolean
}

export type ActionType = 'fold' | 'check' | 'call' | 'bet' | 'raise' | 'allIn'

export interface Action {
    type: ActionType
    /**
     * For `bet`/`raise`: the TOTAL chips this seat will have committed this
     * street after the action (the "raise-to" amount). Ignored for other types.
     */
    amount?: number
}

/** What the seat-to-act is allowed to do right now. */
export interface LegalActions {
    seat: number
    playerId: string
    canFold: boolean
    canCheck: boolean
    canCall: boolean
    /** Chips needed to call (0 when a check is possible). */
    callAmount: number
    /** True if a bet or raise is possible. */
    canRaise: boolean
    /** True when there is no prior bet this street (opening bet vs. raise). */
    isOpeningBet: boolean
    /** Minimum legal raise-to total. */
    minRaiseTo: number
    /** Maximum raise-to total (an all-in). */
    maxRaiseTo: number
}

export interface PotResult {
    amount: number
    eligible: number[]
    winners: { playerId: string; seat: number; amount: number }[]
}

export interface ShowdownEntry {
    seat: number
    playerId: string
    holeCards: Card[]
    handValue: HandValue
}

export interface HandResult {
    pots: PotResult[]
    /** playerId -> total chips added back to their stack. */
    payouts: Record<string, number>
    /** Revealed hands at showdown; empty when the hand ended by everyone folding. */
    showdown: ShowdownEntry[]
    board: Card[]
    /** True when a single player won uncontested (no cards revealed). */
    wonByFold: boolean
}

export type HandEvent =
    | { type: 'handStarted'; handId: string; button: number; sbSeat: number; bbSeat: number }
    | { type: 'blindPosted'; seat: number; playerId: string; amount: number; blind: 'sb' | 'bb' | 'ante' }
    | { type: 'holeCardsDealt' }
    | {
          type: 'action'
          seat: number
          playerId: string
          action: ActionType
          amount: number
          allIn: boolean
      }
    | { type: 'streetAdvanced'; street: Street; board: Card[] }
    | { type: 'showdown'; entries: ShowdownEntry[] }
    | { type: 'potAwarded'; pot: PotResult }
    | { type: 'handComplete'; result: HandResult }

/** Full state of one hand. Treated as immutable by callers (engine returns new state). */
export interface HandState {
    handId: string
    config: HandConfig
    /** Seat number of the dealer button. */
    button: number
    street: Street
    board: Card[]
    /** Remaining undealt cards. */
    deck: Card[]
    /** Participants ordered by ascending seat number. */
    seats: HandSeat[]
    /** Seat number whose turn it is, or null while resolving / complete. */
    actingSeat: number | null
    /** Highest committed-this-street amount that must be matched. */
    betToCall: number
    /** Minimum legal raise increment for the current street. */
    minRaiseSize: number
    lastAggressorSeat: number | null
    result?: HandResult
}
