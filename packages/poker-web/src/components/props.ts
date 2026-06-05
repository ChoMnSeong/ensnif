/**
 * Pinned prop contracts for the presentational poker components.
 * Components implement these exactly so pages and components compose cleanly.
 */
import type {
    Card,
    HandResultSummary,
    LegalActions,
    PlayerActionRequest,
    PublicPot,
    PublicSeat,
    PublicTableState,
} from '@ensnif/poker-engine'

export type CardSize = 'sm' | 'md' | 'lg'

export interface CardViewProps {
    /** The card to show, or null for a face-down card. */
    card: Card | null
    size?: CardSize
    /** Force a face-down back even if `card` is provided. */
    hidden?: boolean
    /** Dim the card (e.g. not part of the winning hand). */
    dimmed?: boolean
}

export interface CommunityCardsProps {
    /** 0–5 revealed board cards. */
    board: Card[]
}

export interface PotDisplayProps {
    totalPot: number
    pots?: PublicPot[]
}

export interface SeatViewProps {
    seat: PublicSeat
    /** True for the viewing player's own seat (renders face-up cards, etc.). */
    isHero: boolean
    bigBlind: number
}

export interface ActionBarProps {
    legal: LegalActions
    /** Chips needed to call (0 if a check is available). */
    betToCall: number
    /** Current central pot (for pot-sized bet shortcuts). */
    pot: number
    bigBlind: number
    onAction: (action: PlayerActionRequest) => void
    disabled?: boolean
}

export interface ResultOverlayProps {
    result: HandResultSummary
}

export interface PokerTableProps {
    state: PublicTableState
}
