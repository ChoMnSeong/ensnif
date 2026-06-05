import type { Card, Rank } from './cards'

/** Hand categories, ordered weakest → strongest. */
export enum HandCategory {
    HighCard = 0,
    Pair = 1,
    TwoPair = 2,
    ThreeOfAKind = 3,
    Straight = 4,
    Flush = 5,
    FullHouse = 6,
    FourOfAKind = 7,
    StraightFlush = 8,
}

export const HAND_CATEGORY_LABELS: Record<HandCategory, string> = {
    [HandCategory.HighCard]: 'High Card',
    [HandCategory.Pair]: 'Pair',
    [HandCategory.TwoPair]: 'Two Pair',
    [HandCategory.ThreeOfAKind]: 'Three of a Kind',
    [HandCategory.Straight]: 'Straight',
    [HandCategory.Flush]: 'Flush',
    [HandCategory.FullHouse]: 'Full House',
    [HandCategory.FourOfAKind]: 'Four of a Kind',
    [HandCategory.StraightFlush]: 'Straight Flush',
}

/**
 * The strength of a 5-card hand.
 *
 * `tiebreak` is an array of ranks ordered by descending importance, so two
 * hand values compare by `category` first, then lexicographically on
 * `tiebreak`. The exact meaning of each slot depends on the category, e.g.
 * full house = [tripRank, pairRank], two pair = [highPair, lowPair, kicker].
 */
export interface HandValue {
    category: HandCategory
    tiebreak: Rank[]
    /** The best 5 cards (only set by {@link evaluateBest}). */
    cards?: Card[]
}

/** Compares two hand values. >0 if a is stronger, <0 if b is stronger, 0 if tied. */
export function compareHandValue(a: HandValue, b: HandValue): number {
    if (a.category !== b.category) return a.category - b.category
    const len = Math.max(a.tiebreak.length, b.tiebreak.length)
    for (let i = 0; i < len; i++) {
        const av = a.tiebreak[i] ?? 0
        const bv = b.tiebreak[i] ?? 0
        if (av !== bv) return av - bv
    }
    return 0
}

/** Describes a {@link HandValue} for UI, e.g. "Full House, Kings over Tens". */
export function describeHandValue(value: HandValue): string {
    return HAND_CATEGORY_LABELS[value.category]
}

/**
 * Detects a straight given a descending list of distinct ranks.
 * Returns the high card of the straight, or 0 if none. Handles the wheel
 * (A-2-3-4-5) where the straight's high card is the 5.
 */
function straightHigh(distinctDesc: Rank[]): Rank {
    // Promote aces low for wheel detection.
    const ranks = distinctDesc.includes(14)
        ? [...distinctDesc, 1]
        : distinctDesc
    let run = 1
    for (let i = 1; i < ranks.length; i++) {
        if (ranks[i] === ranks[i - 1] - 1) {
            run++
            // Descending run ending at i, so the high card sits 4 slots earlier.
            if (run >= 5) return ranks[i - 4]
        } else if (ranks[i] !== ranks[i - 1]) {
            run = 1
        }
    }
    return 0
}

/** Ranks one specific 5-card combination. */
export function rankFiveCards(cards: Card[]): HandValue {
    if (cards.length !== 5) throw new Error('rankFiveCards expects exactly 5 cards')

    const ranksDesc = cards.map((c) => c.rank).sort((a, b) => b - a)

    // Count occurrences of each rank.
    const counts = new Map<Rank, number>()
    for (const r of ranksDesc) counts.set(r, (counts.get(r) ?? 0) + 1)

    // Group ranks by their count, each group sorted by rank desc, and groups
    // ordered by (count desc, rank desc) — the canonical tiebreak ordering.
    const grouped = [...counts.entries()].sort((a, b) => {
        if (a[1] !== b[1]) return b[1] - a[1]
        return b[0] - a[0]
    })
    const countPattern = grouped.map((g) => g[1]) // e.g. [3,2] = full house
    const byCount = grouped.map((g) => g[0])

    const isFlush = cards.every((c) => c.suit === cards[0].suit)

    const distinctDesc = [...new Set(ranksDesc)]
    const sHigh = distinctDesc.length >= 5 ? straightHigh(distinctDesc) : 0
    const isStraight = sHigh > 0

    if (isStraight && isFlush) {
        return { category: HandCategory.StraightFlush, tiebreak: [sHigh] }
    }
    if (countPattern[0] === 4) {
        return { category: HandCategory.FourOfAKind, tiebreak: byCount }
    }
    if (countPattern[0] === 3 && countPattern[1] === 2) {
        return { category: HandCategory.FullHouse, tiebreak: byCount }
    }
    if (isFlush) {
        return { category: HandCategory.Flush, tiebreak: ranksDesc }
    }
    if (isStraight) {
        return { category: HandCategory.Straight, tiebreak: [sHigh] }
    }
    if (countPattern[0] === 3) {
        return { category: HandCategory.ThreeOfAKind, tiebreak: byCount }
    }
    if (countPattern[0] === 2 && countPattern[1] === 2) {
        return { category: HandCategory.TwoPair, tiebreak: byCount }
    }
    if (countPattern[0] === 2) {
        return { category: HandCategory.Pair, tiebreak: byCount }
    }
    return { category: HandCategory.HighCard, tiebreak: ranksDesc }
}

/** All 5-card combinations of the given cards. */
function combinations5(cards: Card[]): Card[][] {
    const n = cards.length
    if (n < 5) throw new Error('Need at least 5 cards to evaluate')
    if (n === 5) return [cards]
    const result: Card[][] = []
    for (let a = 0; a < n - 4; a++)
        for (let b = a + 1; b < n - 3; b++)
            for (let c = b + 1; c < n - 2; c++)
                for (let d = c + 1; d < n - 1; d++)
                    for (let e = d + 1; e < n; e++)
                        result.push([cards[a], cards[b], cards[c], cards[d], cards[e]])
    return result
}

/**
 * Finds the best 5-card hand from 5–7 cards (e.g. 2 hole + up to 5 board).
 * Returns the winning {@link HandValue} with its `cards` populated.
 */
export function evaluateBest(cards: Card[]): HandValue {
    let best: HandValue | null = null
    for (const combo of combinations5(cards)) {
        const value = rankFiveCards(combo)
        if (!best || compareHandValue(value, best) > 0) {
            best = { ...value, cards: combo }
        }
    }
    return best!
}
