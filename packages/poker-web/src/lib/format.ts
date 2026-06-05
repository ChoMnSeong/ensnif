import { rankLabel, suitSymbol, isRedSuit, type Card } from '@ensnif/poker-engine'

/** Formats a chip count with thousands separators. */
export function fmtChips(n: number): string {
    return n.toLocaleString('ko-KR')
}

/** Short form for large stacks, e.g. 12,500 -> 12.5K. */
export function fmtShort(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 10_000) return `${(n / 1000).toFixed(1)}K`
    return n.toLocaleString('ko-KR')
}

export interface CardFace {
    rank: string
    suit: string
    red: boolean
}

export function cardFace(card: Card): CardFace {
    return { rank: rankLabel(card.rank), suit: suitSymbol(card.suit), red: isRedSuit(card.suit) }
}

/** Avatar initial from a display name. */
export function initialOf(name: string | null | undefined): string {
    if (!name) return '?'
    return name.trim().charAt(0).toUpperCase()
}
