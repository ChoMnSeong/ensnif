import type { Card } from './cards'
import { compareHandValue, evaluateBest } from './evaluator'
import type {
    Action,
    HandConfig,
    HandEvent,
    HandPlayer,
    HandResult,
    HandSeat,
    HandState,
    LegalActions,
    PotResult,
    ShowdownEntry,
} from './types'

/* ------------------------------------------------------------------ *
 *  Internal helpers
 * ------------------------------------------------------------------ */

function cloneSeat(s: HandSeat): HandSeat {
    return { ...s, holeCards: s.holeCards.slice() }
}

function cloneState(state: HandState): HandState {
    return {
        ...state,
        board: state.board.slice(),
        deck: state.deck.slice(),
        seats: state.seats.map(cloneSeat),
    }
}

function arrIdxOfSeat(state: HandState, seatNo: number): number {
    return state.seats.findIndex((s) => s.seat === seatNo)
}

function draw(state: HandState, n: number): Card[] {
    return state.deck.splice(0, n)
}

/** Number of seats still in the hand (not folded). */
function notFoldedSeats(state: HandState): HandSeat[] {
    return state.seats.filter((s) => s.status !== 'folded')
}

/** Seats that can still act (hold chips and haven't folded / gone all-in). */
function activeSeats(state: HandState): HandSeat[] {
    return state.seats.filter((s) => s.status === 'active')
}

/**
 * First seat (clockwise from `fromArrIdxExclusive`) that still owes an action
 * this street, or null if the round is settled. A seat owes action when it is
 * active and either hasn't acted since the last raise or hasn't matched the bet.
 */
function selectNextActor(state: HandState, fromArrIdxExclusive: number): number | null {
    const n = state.seats.length
    for (let k = 1; k <= n; k++) {
        const idx = (fromArrIdxExclusive + k) % n
        const s = state.seats[idx]
        if (s.status === 'active' && (!s.hasActed || s.committedThisStreet < state.betToCall)) {
            return s.seat
        }
    }
    return null
}

/** First active seat clockwise from the button, used to open postflop streets. */
function firstActiveFromButton(state: HandState): number | null {
    const buttonIdx = arrIdxOfSeat(state, state.button)
    const n = state.seats.length
    for (let k = 1; k <= n; k++) {
        const s = state.seats[(buttonIdx + k) % n]
        if (s.status === 'active') return s.seat
    }
    return null
}

/* ------------------------------------------------------------------ *
 *  Hand creation
 * ------------------------------------------------------------------ */

/**
 * Starts a new hand: posts blinds, deals hole cards, and sets the first actor.
 * `deck` must already be shuffled and contain enough cards.
 * `button` must be the seat number of one of the participating players.
 */
export function createHand(
    handId: string,
    players: HandPlayer[],
    button: number,
    config: HandConfig,
    deck: Card[],
): { state: HandState; events: HandEvent[] } {
    if (players.length < 2) throw new Error('Need at least 2 players to start a hand')

    const seats: HandSeat[] = players
        .slice()
        .sort((a, b) => a.seat - b.seat)
        .map((p) => ({
            seat: p.seat,
            playerId: p.playerId,
            name: p.name,
            startingStack: p.stack,
            stack: p.stack,
            committedThisStreet: 0,
            totalCommitted: 0,
            holeCards: [],
            status: 'active' as const,
            hasActed: false,
        }))

    const n = seats.length
    const buttonIdx = seats.findIndex((s) => s.seat === button)
    if (buttonIdx < 0) throw new Error('Button must be on a participating seat')

    const state: HandState = {
        handId,
        config,
        button,
        street: 'preflop',
        board: [],
        deck: deck.slice(),
        seats,
        actingSeat: null,
        betToCall: 0,
        minRaiseSize: config.bigBlind,
        lastAggressorSeat: null,
    }

    const events: HandEvent[] = []
    const heuristicHeadsUp = n === 2

    const sbIdx = heuristicHeadsUp ? buttonIdx : (buttonIdx + 1) % n
    const bbIdx = heuristicHeadsUp ? (buttonIdx + 1) % n : (sbIdx + 1) % n

    events.push({
        type: 'handStarted',
        handId,
        button,
        sbSeat: seats[sbIdx].seat,
        bbSeat: seats[bbIdx].seat,
    })

    // Antes (optional).
    if (config.ante && config.ante > 0) {
        for (const s of seats) {
            const amt = Math.min(config.ante, s.stack)
            if (amt <= 0) continue
            s.stack -= amt
            s.totalCommitted += amt
            if (s.stack === 0) s.status = 'allIn'
            events.push({ type: 'blindPosted', seat: s.seat, playerId: s.playerId, amount: amt, blind: 'ante' })
        }
    }

    const postBlind = (idx: number, blind: number, label: 'sb' | 'bb') => {
        const s = seats[idx]
        const amt = Math.min(blind, s.stack)
        s.stack -= amt
        s.committedThisStreet += amt
        s.totalCommitted += amt
        if (s.stack === 0) s.status = 'allIn'
        events.push({ type: 'blindPosted', seat: s.seat, playerId: s.playerId, amount: amt, blind: label })
    }
    postBlind(sbIdx, config.smallBlind, 'sb')
    postBlind(bbIdx, config.bigBlind, 'bb')

    // The bet level is at least the nominal big blind, even when the BB could
    // only post a short all-in for less — players still owe a full big blind.
    state.betToCall = Math.max(config.bigBlind, ...seats.map((s) => s.committedThisStreet))
    state.minRaiseSize = config.bigBlind
    state.lastAggressorSeat = seats[bbIdx].seat

    // Deal two hole cards to each seat (order is cosmetic with a shuffled deck).
    for (let round = 0; round < 2; round++) {
        for (const s of seats) {
            s.holeCards.push(...draw(state, 1))
        }
    }
    events.push({ type: 'holeCardsDealt' })

    // First to act preflop: heads-up -> button(SB); otherwise the seat after BB (UTG).
    const firstIdx = heuristicHeadsUp ? buttonIdx : (bbIdx + 1) % n
    state.actingSeat = selectNextActor(state, (firstIdx - 1 + n) % n)

    // If everyone is already all-in from blinds, run it out immediately.
    if (state.actingSeat === null) {
        const after = cloneState(state)
        progress(after, events, buttonIdx)
        return { state: after, events }
    }

    return { state, events }
}

/* ------------------------------------------------------------------ *
 *  Legal actions
 * ------------------------------------------------------------------ */

export function legalActions(state: HandState): LegalActions | null {
    if (state.actingSeat === null) return null
    const idx = arrIdxOfSeat(state, state.actingSeat)
    const s = state.seats[idx]
    if (!s || s.status !== 'active') return null

    const toCall = Math.max(0, state.betToCall - s.committedThisStreet)
    const canCheck = toCall === 0
    const canCall = toCall > 0 && s.stack > 0
    const callAmount = Math.min(toCall, s.stack)

    const isOpeningBet = state.betToCall === 0
    const canRaise = s.stack > toCall // strictly more chips than needed to call
    const bb = state.config.bigBlind

    // Minimum raise-to: opening bet -> one big blind; otherwise prior bet + last raise size.
    let minRaiseTo = isOpeningBet ? bb : state.betToCall + state.minRaiseSize
    const maxRaiseTo = s.committedThisStreet + s.stack // all-in total
    if (minRaiseTo > maxRaiseTo) minRaiseTo = maxRaiseTo // short stack can only shove

    return {
        seat: s.seat,
        playerId: s.playerId,
        canFold: true,
        canCheck,
        canCall,
        callAmount,
        canRaise,
        isOpeningBet,
        minRaiseTo,
        maxRaiseTo,
    }
}

/* ------------------------------------------------------------------ *
 *  Apply an action
 * ------------------------------------------------------------------ */

export function applyAction(
    state: HandState,
    playerId: string,
    action: Action,
): { state: HandState; events: HandEvent[] } {
    if (state.actingSeat === null || state.street === 'complete') {
        throw new Error('No action expected right now')
    }
    const la = legalActions(state)
    if (!la) throw new Error('No legal action available')
    if (la.playerId !== playerId) throw new Error('Not your turn')

    const next = cloneState(state)
    const idx = arrIdxOfSeat(next, next.actingSeat!)
    const s = next.seats[idx]
    const events: HandEvent[] = []

    let actedAmount = 0
    let wentAllIn = false

    switch (action.type) {
        case 'fold': {
            s.status = 'folded'
            s.hasActed = true
            break
        }
        case 'check': {
            if (!la.canCheck) throw new Error('Cannot check facing a bet')
            s.hasActed = true
            break
        }
        case 'call': {
            if (!la.canCall) throw new Error('Nothing to call')
            const pay = la.callAmount
            s.stack -= pay
            s.committedThisStreet += pay
            s.totalCommitted += pay
            actedAmount = pay
            s.hasActed = true
            if (s.stack === 0) {
                s.status = 'allIn'
                wentAllIn = true
            }
            break
        }
        case 'bet':
        case 'raise':
        case 'allIn': {
            if (!la.canRaise) throw new Error('Cannot raise')
            const target =
                action.type === 'allIn' ? la.maxRaiseTo : Math.floor(action.amount ?? 0)
            // Validate the raise-to amount. A shove (== maxRaiseTo) is always allowed,
            // even when it is smaller than a full minimum raise.
            const isShove = target === la.maxRaiseTo
            if (!isShove && (target < la.minRaiseTo || target > la.maxRaiseTo)) {
                throw new Error(`Raise-to ${target} outside [${la.minRaiseTo}, ${la.maxRaiseTo}]`)
            }
            if (target <= s.committedThisStreet) throw new Error('Raise must increase the bet')

            const pay = target - s.committedThisStreet
            const prevBetToCall = next.betToCall
            const raiseIncrement = target - prevBetToCall

            s.stack -= pay
            s.committedThisStreet = target
            s.totalCommitted += pay
            actedAmount = pay
            s.hasActed = true
            if (s.stack === 0) {
                s.status = 'allIn'
                wentAllIn = true
            }

            next.betToCall = Math.max(next.betToCall, target)

            // A full raise (>= the current minimum increment) reopens betting.
            const isFullRaise = raiseIncrement >= next.minRaiseSize
            if (isFullRaise) {
                next.minRaiseSize = raiseIncrement
                next.lastAggressorSeat = s.seat
                for (const other of next.seats) {
                    if (other.seat !== s.seat && other.status === 'active') other.hasActed = false
                }
            }
            break
        }
        default:
            throw new Error(`Unknown action: ${(action as Action).type}`)
    }

    events.push({
        type: 'action',
        seat: s.seat,
        playerId: s.playerId,
        action: action.type,
        amount: actedAmount,
        allIn: wentAllIn,
    })

    progress(next, events, idx)
    return { state: next, events }
}

/* ------------------------------------------------------------------ *
 *  Round / street progression
 * ------------------------------------------------------------------ */

function resetForNextStreet(state: HandState) {
    for (const s of state.seats) {
        s.committedThisStreet = 0
        if (s.status === 'active') s.hasActed = false
    }
    state.betToCall = 0
    state.minRaiseSize = state.config.bigBlind
    state.lastAggressorSeat = null
}

function dealStreetCards(state: HandState): void {
    if (state.board.length === 0) {
        state.board.push(...draw(state, 3))
        state.street = 'flop'
    } else if (state.board.length === 3) {
        state.board.push(...draw(state, 1))
        state.street = 'turn'
    } else if (state.board.length === 4) {
        state.board.push(...draw(state, 1))
        state.street = 'river'
    }
}

/**
 * Advances the hand after an action: decides whether the betting round is over,
 * deals the next street, runs out all-in boards, or resolves the showdown.
 */
function progress(state: HandState, events: HandEvent[], lastActorArrIdx: number): void {
    // 1. Everyone folded to one player.
    const live = notFoldedSeats(state)
    if (live.length === 1) {
        settleByFold(state, events, live[0])
        return
    }

    // 2. Is the current betting round complete?
    const actable = activeSeats(state)
    const allMatched = actable.every((s) => s.hasActed && s.committedThisStreet === state.betToCall)
    const roundComplete = actable.length === 0 || allMatched

    if (!roundComplete) {
        state.actingSeat = selectNextActor(state, lastActorArrIdx)
        return
    }

    // 3. Round complete — gather bets and move on.
    resetForNextStreet(state)

    // If at most one player can still act, run the remaining board with no betting.
    const canStillBet = state.seats.filter((s) => s.status === 'active').length
    if (state.street === 'river' || canStillBet <= 1) {
        while (state.board.length < 5) {
            dealStreetCards(state)
            events.push({ type: 'streetAdvanced', street: state.street, board: state.board.slice() })
        }
        resolveShowdown(state, events)
        return
    }

    // 4. Otherwise deal the next street and continue betting.
    dealStreetCards(state)
    events.push({ type: 'streetAdvanced', street: state.street, board: state.board.slice() })
    state.actingSeat = firstActiveFromButton(state)

    // Edge: only all-in players remain past this point (no one to act) -> run out.
    if (state.actingSeat === null) {
        while (state.board.length < 5) {
            dealStreetCards(state)
            events.push({ type: 'streetAdvanced', street: state.street, board: state.board.slice() })
        }
        resolveShowdown(state, events)
    }
}

/* ------------------------------------------------------------------ *
 *  Pot building & settlement
 * ------------------------------------------------------------------ */

/** Builds main + side pots from each seat's total contribution. */
export function buildPots(seats: HandSeat[]): { amount: number; eligible: number[] }[] {
    const contributors = seats.filter((s) => s.totalCommitted > 0)
    const levels = [...new Set(contributors.map((s) => s.totalCommitted))].sort((a, b) => a - b)

    const pots: { amount: number; eligible: number[] }[] = []
    let prev = 0
    for (const level of levels) {
        let amount = 0
        for (const s of seats) {
            amount += Math.max(0, Math.min(s.totalCommitted, level) - Math.min(s.totalCommitted, prev))
        }
        const eligible = seats
            .filter((s) => s.status !== 'folded' && s.totalCommitted >= level)
            .map((s) => s.seat)
        if (amount > 0) pots.push({ amount, eligible })
        prev = level
    }

    // Merge adjacent pots that have the same eligible set (they pay out identically).
    const merged: { amount: number; eligible: number[] }[] = []
    for (const pot of pots) {
        const last = merged[merged.length - 1]
        if (last && last.eligible.length === pot.eligible.length && last.eligible.every((e, i) => e === pot.eligible[i])) {
            last.amount += pot.amount
        } else {
            merged.push({ amount: pot.amount, eligible: pot.eligible.slice() })
        }
    }
    return merged
}

/** Orders seat numbers clockwise starting just left of the button (for odd-chip distribution). */
function clockwiseFromButton(state: HandState, seatNos: number[]): number[] {
    const buttonIdx = arrIdxOfSeat(state, state.button)
    const n = state.seats.length
    return seatNos.slice().sort((a, b) => {
        const da = (arrIdxOfSeat(state, a) - buttonIdx - 1 + n) % n
        const db = (arrIdxOfSeat(state, b) - buttonIdx - 1 + n) % n
        return da - db
    })
}

function settleByFold(state: HandState, events: HandEvent[], winner: HandSeat): void {
    const total = state.seats.reduce((sum, s) => sum + s.totalCommitted, 0)
    const winSeat = state.seats.find((s) => s.seat === winner.seat)!
    winSeat.stack += total

    const pot: PotResult = {
        amount: total,
        eligible: [winner.seat],
        winners: [{ playerId: winner.playerId, seat: winner.seat, amount: total }],
    }
    const result: HandResult = {
        pots: [pot],
        payouts: { [winner.playerId]: total },
        showdown: [],
        board: state.board.slice(),
        wonByFold: true,
    }
    state.result = result
    state.actingSeat = null
    state.street = 'complete'
    events.push({ type: 'potAwarded', pot })
    events.push({ type: 'handComplete', result })
}

function resolveShowdown(state: HandState, events: HandEvent[]): void {
    state.street = 'showdown'
    state.actingSeat = null

    const contenders = notFoldedSeats(state)
    const handValues = new Map<number, ReturnType<typeof evaluateBest>>()
    const entries: ShowdownEntry[] = []
    for (const s of contenders) {
        const hv = evaluateBest([...s.holeCards, ...state.board])
        handValues.set(s.seat, hv)
        entries.push({ seat: s.seat, playerId: s.playerId, holeCards: s.holeCards.slice(), handValue: hv })
    }
    events.push({ type: 'showdown', entries })

    const payouts: Record<string, number> = {}
    const potResults: PotResult[] = []

    for (const pot of buildPots(state.seats)) {
        const eligible = pot.eligible.filter((seatNo) => handValues.has(seatNo))
        if (eligible.length === 0) continue

        // Best hand among eligible seats.
        let best = eligible[0]
        for (const seatNo of eligible) {
            if (compareHandValue(handValues.get(seatNo)!, handValues.get(best)!) > 0) best = seatNo
        }
        const winners = eligible.filter((seatNo) => compareHandValue(handValues.get(seatNo)!, handValues.get(best)!) === 0)

        const base = Math.floor(pot.amount / winners.length)
        let remainder = pot.amount - base * winners.length
        const ordered = clockwiseFromButton(state, winners)

        const potResult: PotResult = { amount: pot.amount, eligible: pot.eligible, winners: [] }
        for (const seatNo of ordered) {
            let share = base
            if (remainder > 0) {
                share += 1
                remainder -= 1
            }
            const seat = state.seats.find((s) => s.seat === seatNo)!
            seat.stack += share
            payouts[seat.playerId] = (payouts[seat.playerId] ?? 0) + share
            potResult.winners.push({ playerId: seat.playerId, seat: seatNo, amount: share })
        }
        potResults.push(potResult)
        events.push({ type: 'potAwarded', pot: potResult })
    }

    const result: HandResult = {
        pots: potResults,
        payouts,
        showdown: entries,
        board: state.board.slice(),
        wonByFold: false,
    }
    state.result = result
    state.street = 'complete'
    events.push({ type: 'handComplete', result })
}

/* ------------------------------------------------------------------ *
 *  Read helpers
 * ------------------------------------------------------------------ */

/** Total chips already committed to the pot across all streets. */
export function potTotal(state: HandState): number {
    return state.seats.reduce((sum, s) => sum + s.totalCommitted, 0)
}

export function isHandComplete(state: HandState): boolean {
    return state.street === 'complete'
}
