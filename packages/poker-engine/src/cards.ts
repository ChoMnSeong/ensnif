import type { Rng } from './rng'

/** Suit codes: clubs, diamonds, hearts, spades. */
export type Suit = 'c' | 'd' | 'h' | 's'

export const SUITS: readonly Suit[] = ['c', 'd', 'h', 's']

/**
 * Card rank as a number for easy comparison.
 * 2..10 are themselves; J=11, Q=12, K=13, A=14 (aces high; the wheel A-5 is
 * handled specially inside the evaluator).
 */
export type Rank = number

export const RANKS: readonly Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

export interface Card {
    rank: Rank
    suit: Suit
}

const RANK_TO_CHAR: Record<number, string> = {
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: 'T',
    11: 'J',
    12: 'Q',
    13: 'K',
    14: 'A',
}

const CHAR_TO_RANK: Record<string, number> = Object.fromEntries(
    Object.entries(RANK_TO_CHAR).map(([rank, char]) => [char, Number(rank)]),
)

const SUIT_SYMBOLS: Record<Suit, string> = {
    c: '♣',
    d: '♦',
    h: '♥',
    s: '♠',
}

/** Human label for a rank: 'A', 'K', 'Q', 'J', 'T', '9'... */
export function rankLabel(rank: Rank): string {
    return RANK_TO_CHAR[rank] ?? String(rank)
}

export function suitSymbol(suit: Suit): string {
    return SUIT_SYMBOLS[suit]
}

export function isRedSuit(suit: Suit): boolean {
    return suit === 'd' || suit === 'h'
}

/** Compact id like 'As', 'Td', '2c'. */
export function cardToString(card: Card): string {
    return `${RANK_TO_CHAR[card.rank]}${card.suit}`
}

export function cardFromString(id: string): Card {
    const rank = CHAR_TO_RANK[id[0].toUpperCase()]
    const suit = id[1].toLowerCase() as Suit
    if (rank === undefined || !SUITS.includes(suit)) {
        throw new Error(`Invalid card id: ${id}`)
    }
    return { rank, suit }
}

/** Returns a fresh, ordered 52-card deck. */
export function createDeck(): Card[] {
    const deck: Card[] = []
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({ rank, suit })
        }
    }
    return deck
}

/** Fisher–Yates shuffle. Returns a new array; does not mutate the input. */
export function shuffle(deck: readonly Card[], rng: Rng): Card[] {
    const out = deck.slice()
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rng.next() * (i + 1))
        ;[out[i], out[j]] = [out[j], out[i]]
    }
    return out
}

/** Convenience: a freshly shuffled deck. */
export function shuffledDeck(rng: Rng): Card[] {
    return shuffle(createDeck(), rng)
}
