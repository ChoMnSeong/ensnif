import { describe, expect, it } from 'vitest'
import { type Card, cardFromString, cardToString, createDeck } from './cards'
import { applyAction, buildPots, createHand, legalActions } from './holdem'
import type { HandPlayer, HandState } from './types'

/** Builds a full 52-card deck whose first cards are exactly `prefix`. */
function deckWith(prefix: string[]): Card[] {
    const want = prefix.map(cardFromString)
    const used = new Set(prefix.map((id) => cardToString(cardFromString(id))))
    const rest = createDeck().filter((c) => !used.has(cardToString(c)))
    return [...want, ...rest]
}

const players = (...specs: [seat: number, name: string, stack: number][]): HandPlayer[] =>
    specs.map(([seat, name, stack]) => ({ seat, playerId: name, name, stack }))

/**
 * Sum of all stacks. Once a hand is complete every committed chip has been
 * redistributed back into stacks, so this must equal the starting total.
 */
function totalChips(state: HandState): number {
    return state.seats.reduce((sum, s) => sum + s.stack, 0)
}

describe('createHand (heads-up)', () => {
    it('posts blinds and lets the button (SB) act first preflop', () => {
        const deck = deckWith(['As', 'Kc', 'Ah', 'Kd', '2c', '7d', '9s', 'Jh', '3c'])
        const { state } = createHand('h1', players([0, 'A', 1000], [1, 'B', 1000]), 0, { smallBlind: 10, bigBlind: 20 }, deck)
        expect(state.seats[0].committedThisStreet).toBe(10) // A = SB
        expect(state.seats[1].committedThisStreet).toBe(20) // B = BB
        expect(state.betToCall).toBe(20)
        expect(state.actingSeat).toBe(0) // button acts first heads-up
        expect(state.seats[0].holeCards.map(cardToString)).toEqual(['As', 'Ah'])
    })

    it('plays a checked-down hand and awards the pot to the best hand', () => {
        const deck = deckWith(['As', 'Kc', 'Ah', 'Kd', '2c', '7d', '9s', 'Jh', '3c'])
        let { state } = createHand('h1', players([0, 'A', 1000], [1, 'B', 1000]), 0, { smallBlind: 10, bigBlind: 20 }, deck)

        ;({ state } = applyAction(state, 'A', { type: 'call' })) // SB completes
        ;({ state } = applyAction(state, 'B', { type: 'check' })) // BB checks option
        // flop, turn, river: BB (seat 1) acts first postflop heads-up.
        ;({ state } = applyAction(state, 'B', { type: 'check' }))
        ;({ state } = applyAction(state, 'A', { type: 'check' }))
        ;({ state } = applyAction(state, 'B', { type: 'check' }))
        ;({ state } = applyAction(state, 'A', { type: 'check' }))
        ;({ state } = applyAction(state, 'B', { type: 'check' }))
        ;({ state } = applyAction(state, 'A', { type: 'check' }))

        expect(state.street).toBe('complete')
        expect(state.result?.wonByFold).toBe(false)
        expect(state.result?.payouts).toEqual({ A: 40 })
        expect(state.seats[0].stack).toBe(1020) // A wins 20 net
        expect(state.seats[1].stack).toBe(980)
        expect(totalChips(state)).toBe(2000)
    })
})

describe('folding', () => {
    it('awards the pot uncontested when everyone folds', () => {
        const deck = deckWith(['As', 'Kc', 'Ah', 'Kd'])
        let { state } = createHand('h1', players([0, 'A', 1000], [1, 'B', 1000]), 0, { smallBlind: 10, bigBlind: 20 }, deck)
        ;({ state } = applyAction(state, 'A', { type: 'raise', amount: 60 }))
        ;({ state } = applyAction(state, 'B', { type: 'fold' }))
        expect(state.street).toBe('complete')
        expect(state.result?.wonByFold).toBe(true)
        expect(state.result?.showdown).toEqual([])
        expect(state.seats[0].stack).toBe(1020) // wins B's 20
        expect(totalChips(state)).toBe(2000)
    })
})

describe('raise validation', () => {
    it('rejects a raise below the minimum', () => {
        const deck = deckWith(['As', 'Kc', 'Ah', 'Kd'])
        const { state } = createHand('h1', players([0, 'A', 1000], [1, 'B', 1000]), 0, { smallBlind: 10, bigBlind: 20 }, deck)
        const la = legalActions(state)!
        expect(la.minRaiseTo).toBe(40) // bb 20 + min raise 20
        expect(() => applyAction(state, 'A', { type: 'raise', amount: 25 })).toThrow()
        expect(() => applyAction(state, 'A', { type: 'raise', amount: 40 })).not.toThrow()
    })

    it('rejects acting out of turn', () => {
        const deck = deckWith(['As', 'Kc', 'Ah', 'Kd'])
        const { state } = createHand('h1', players([0, 'A', 1000], [1, 'B', 1000]), 0, { smallBlind: 10, bigBlind: 20 }, deck)
        expect(() => applyAction(state, 'B', { type: 'check' })).toThrow(/turn/i)
    })
})

describe('short all-in big blind', () => {
    it('keeps the bet level at a full big blind when the BB is short all-in', () => {
        // 3-handed: SB = seat1, BB = seat2 (only 15 chips), UTG = seat0.
        const deck = deckWith(['As', 'Kc', '2c', 'Ad', 'Kh', '2d'])
        const { state } = createHand(
            'h1',
            players([0, 'A', 1000], [1, 'B', 1000], [2, 'C', 15]),
            0,
            { smallBlind: 10, bigBlind: 20 },
            deck,
        )
        expect(state.seats[2].status).toBe('allIn') // C posted 15, all-in
        expect(state.betToCall).toBe(20) // floored to a full big blind, not 15
        const la = legalActions(state)!
        expect(la.seat).toBe(0) // UTG to act
        expect(la.callAmount).toBe(20)
        expect(la.minRaiseTo).toBe(40)
    })
})

describe('side pots (3-handed all-in)', () => {
    it('splits a main pot and a side pot correctly', () => {
        // A is short (100). A shoves, B re-raises, C folds. A wins main, B wins side.
        const deck = deckWith(['As', 'Kc', '2c', 'Ad', 'Kh', '2d', '5s', '7h', '9c', 'Jd', '3s'])
        let { state } = createHand(
            'h1',
            players([0, 'A', 100], [1, 'B', 1000], [2, 'C', 1000]),
            0,
            { smallBlind: 10, bigBlind: 20 },
            deck,
        )
        // 3-handed: SB = seat1 (B), BB = seat2 (C), UTG = seat0 (A).
        ;({ state } = applyAction(state, 'A', { type: 'allIn' })) // A all-in 100
        ;({ state } = applyAction(state, 'B', { type: 'raise', amount: 300 }))
        ;({ state } = applyAction(state, 'C', { type: 'fold' }))

        expect(state.street).toBe('complete')
        expect(state.result?.pots).toHaveLength(2)
        // A (AA) beats B (KK) for the main pot; B takes the side pot uncontested.
        expect(state.result?.payouts).toEqual({ A: 220, B: 200 })
        expect(state.seats[0].stack).toBe(220)
        expect(state.seats[1].stack).toBe(900)
        expect(state.seats[2].stack).toBe(980)
        expect(totalChips(state)).toBe(2100)
    })
})

describe('split pot with odd chip', () => {
    it('awards the odd chip to the first seat left of the button', () => {
        // Board is four aces + king: A (seat0, button) and C (seat2) tie; B (seat1) folds.
        const deck = deckWith(['2c', '3c', '4c', '5c', '6c', '7c', 'As', 'Ah', 'Ad', 'Ac', 'Ks'])
        let { state } = createHand(
            'h1',
            players([0, 'A', 1000], [1, 'B', 1000], [2, 'C', 1000]),
            0,
            { smallBlind: 5, bigBlind: 10 },
            deck,
        )
        // SB = B (seat1), BB = C (seat2), UTG = A (seat0).
        ;({ state } = applyAction(state, 'A', { type: 'raise', amount: 20 }))
        ;({ state } = applyAction(state, 'B', { type: 'fold' }))
        ;({ state } = applyAction(state, 'C', { type: 'call' }))
        // Check it down: C (seat2) acts first postflop.
        ;({ state } = applyAction(state, 'C', { type: 'check' }))
        ;({ state } = applyAction(state, 'A', { type: 'check' }))
        ;({ state } = applyAction(state, 'C', { type: 'check' }))
        ;({ state } = applyAction(state, 'A', { type: 'check' }))
        ;({ state } = applyAction(state, 'C', { type: 'check' }))
        ;({ state } = applyAction(state, 'A', { type: 'check' }))

        expect(state.street).toBe('complete')
        // Pot = 45 (A 20 + C 20 + B's dead 5). Split 22 / 23, odd chip to C (left of button).
        expect(state.result?.payouts).toEqual({ A: 22, C: 23 })
        expect(totalChips(state)).toBe(3000)
    })
})

describe('buildPots', () => {
    it('creates layered pots ignoring folded players for eligibility', () => {
        const seats = [
            { seat: 0, totalCommitted: 100, status: 'allIn' },
            { seat: 1, totalCommitted: 300, status: 'active' },
            { seat: 2, totalCommitted: 20, status: 'folded' },
        ] as Parameters<typeof buildPots>[0]
        const pots = buildPots(seats)
        expect(pots).toEqual([
            { amount: 220, eligible: [0, 1] },
            { amount: 200, eligible: [1] },
        ])
    })
})
