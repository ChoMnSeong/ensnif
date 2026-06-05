import { nanoid } from 'nanoid'
import {
    applyAction,
    buildPots,
    createHand,
    describeHandValue,
    legalActions,
    mathRandomRng,
    potTotal,
    rankLabel,
    shuffledDeck,
    type Action,
    type GameLogEntry,
    type HandEvent,
    type HandResultSummary,
    type HandState,
    type LobbyTable,
    type PublicSeat,
    type PublicTableState,
    type SeatViewStatus,
    type TableConfig,
} from '@ensnif/poker-engine'
import type { AppSocket } from '../ioTypes'

export interface TableDeps {
    /** Atomically move chips on a user's bankroll; throws if it would go negative. */
    adjustChips(userId: string, delta: number, reason: string): number
    getChips(userId: string): number
    turnSeconds: number
    /** Called whenever lobby-visible state changes (seat count / in-hand). */
    onLobbyChanged(): void
}

interface TableSeat {
    seat: number
    userId: string | null
    name: string
    color: string
    /** Chips in play at the table (between hands). */
    stack: number
    sittingOut: boolean
    connected: boolean
    /** Cash out as soon as the current hand finishes. */
    pendingLeave: boolean
    disconnectTimer: NodeJS.Timeout | null
}

const AVATAR_COLORS = [
    '#e2504a',
    '#e8893b',
    '#d9b13a',
    '#5aa84f',
    '#3b9ea8',
    '#3b6fe0',
    '#7d4fe0',
    '#d44e9e',
    '#8a8f99',
]

function colorFor(userId: string): string {
    let h = 0
    for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) >>> 0
    return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

/** How long a disconnected player keeps their seat before being cashed out. */
const DISCONNECT_GRACE_MS = 45_000

/**
 * A single live cash table. Owns the seats, the in-progress {@link HandState},
 * turn timers, and per-viewer state broadcasting. The engine stays pure — this
 * class drives it, persists chip movements, and emits sanitized views.
 */
export class Table {
    readonly config: TableConfig
    private deps: TableDeps
    private seats: TableSeat[]
    private hand: HandState | null = null
    private buttonSeat: number | null = null
    private lastResult: HandResultSummary | null = null
    private members = new Map<string, AppSocket>()
    private turnTimer: NodeJS.Timeout | null = null
    private turnDeadline: number | null = null
    private nextHandTimer: NodeJS.Timeout | null = null

    constructor(config: TableConfig, deps: TableDeps) {
        this.config = config
        this.deps = deps
        this.seats = Array.from({ length: config.maxSeats }, (_, seat) => ({
            seat,
            userId: null,
            name: '',
            color: '',
            stack: 0,
            sittingOut: false,
            connected: false,
            pendingLeave: false,
            disconnectTimer: null,
        }))
    }

    private get room(): string {
        return `table:${this.config.id}`
    }

    /* ---------------------------------------------------------------- *
     *  Membership / seating
     * ---------------------------------------------------------------- */

    private seatOf(userId: string): TableSeat | undefined {
        return this.seats.find((s) => s.userId === userId)
    }

    private occupied(): TableSeat[] {
        return this.seats.filter((s) => s.userId)
    }

    private eligible(): TableSeat[] {
        return this.seats.filter((s) => s.userId && s.stack > 0 && !s.sittingOut && s.connected)
    }

    hasMember(userId: string): boolean {
        return this.members.has(userId)
    }

    isSeated(userId: string): boolean {
        return !!this.seatOf(userId)
    }

    /** Buy in and take a seat. Returns the seat number. Throws on any failure. */
    join(socket: AppSocket, userId: string, name: string, buyIn: number, preferredSeat?: number): number {
        if (this.seatOf(userId)) throw new Error('이미 이 테이블에 앉아 있습니다')
        if (!Number.isInteger(buyIn) || buyIn < this.config.minBuyIn || buyIn > this.config.maxBuyIn) {
            throw new Error(`바이인은 ${this.config.minBuyIn}~${this.config.maxBuyIn} 사이여야 합니다`)
        }
        if (this.deps.getChips(userId) < buyIn) throw new Error('보유 칩이 부족합니다')

        let seat =
            preferredSeat !== undefined ? this.seats.find((s) => s.seat === preferredSeat && !s.userId) : undefined
        seat ??= this.seats.find((s) => !s.userId)
        if (!seat) throw new Error('빈 자리가 없습니다')

        // Deduct the buy-in from the bankroll first (throws if insufficient).
        this.deps.adjustChips(userId, -buyIn, `buyin:${this.config.id}`)

        seat.userId = userId
        seat.name = name
        seat.color = colorFor(userId)
        seat.stack = buyIn
        seat.sittingOut = false
        seat.connected = true
        seat.pendingLeave = false

        this.members.set(userId, socket)
        void socket.join(this.room)

        this.pushLog('system', `${name} 님이 ${buyIn.toLocaleString()} 칩으로 참가했습니다`)
        this.deps.onLobbyChanged()
        this.scheduleStart(1200)
        this.broadcast()
        return seat.seat
    }

    /** Re-attach a socket for a player who is already seated (reconnect). */
    reattach(socket: AppSocket, userId: string): boolean {
        const seat = this.seatOf(userId)
        if (!seat) return false
        if (seat.disconnectTimer) {
            clearTimeout(seat.disconnectTimer)
            seat.disconnectTimer = null
        }
        seat.connected = true
        this.members.set(userId, socket)
        void socket.join(this.room)
        this.broadcast()
        return true
    }

    /** Handle a socket disconnect: keep the seat for a grace period, then cash out. */
    handleDisconnect(userId: string): void {
        const seat = this.seatOf(userId)
        this.members.delete(userId)
        if (!seat) return
        seat.connected = false

        // If it's their turn, act for them immediately so the table doesn't stall.
        if (this.hand && this.hand.actingSeat === seat.seat) this.autoActFor(seat.seat)

        if (seat.disconnectTimer) clearTimeout(seat.disconnectTimer)
        seat.disconnectTimer = setTimeout(() => this.leave(userId, 'disconnect'), DISCONNECT_GRACE_MS)
        this.broadcast()
        this.deps.onLobbyChanged()
    }

    /** Voluntarily leave the table (cash out remaining chips). */
    leave(userId: string, reason: 'leave' | 'disconnect' = 'leave'): void {
        const seat = this.seatOf(userId)
        if (!seat) return

        const inLiveHand =
            this.hand !== null &&
            this.hand.street !== 'complete' &&
            this.hand.seats.some((hs) => hs.seat === seat.seat && hs.status !== 'folded')

        if (inLiveHand) {
            // Fold (if it's their turn) and cash out when the hand resolves.
            seat.sittingOut = true
            seat.pendingLeave = true
            if (this.hand && this.hand.actingSeat === seat.seat) this.autoActFor(seat.seat)
            this.broadcast()
            return
        }
        this.cashOut(seat, reason)
    }

    private cashOut(seat: TableSeat, reason: string): void {
        if (!seat.userId) return
        const userId = seat.userId
        const name = seat.name
        const returned = seat.stack
        if (returned > 0) this.deps.adjustChips(userId, returned, `cashout:${this.config.id}:${reason}`)
        if (seat.disconnectTimer) {
            clearTimeout(seat.disconnectTimer)
            seat.disconnectTimer = null
        }
        const socket = this.members.get(userId)
        if (socket) void socket.leave(this.room)
        this.members.delete(userId)

        seat.userId = null
        seat.name = ''
        seat.color = ''
        seat.stack = 0
        seat.sittingOut = false
        seat.connected = false
        seat.pendingLeave = false

        this.pushLog('system', `${name} 님이 ${returned.toLocaleString()} 칩을 들고 떠났습니다`)
        this.deps.onLobbyChanged()
        this.broadcast()
    }

    setSitOut(userId: string, sitOut: boolean): void {
        const seat = this.seatOf(userId)
        if (!seat) return
        seat.sittingOut = sitOut
        if (!sitOut && seat.stack > 0) this.scheduleStart(800)
        this.broadcast()
        this.deps.onLobbyChanged()
    }

    rebuy(userId: string, amount: number): void {
        const seat = this.seatOf(userId)
        if (!seat) throw new Error('테이블에 앉아 있지 않습니다')
        const target = seat.stack + amount
        if (!Number.isInteger(amount) || amount <= 0 || target > this.config.maxBuyIn) {
            throw new Error(`리바이 후 스택은 ${this.config.maxBuyIn} 이하여야 합니다`)
        }
        if (this.deps.getChips(userId) < amount) throw new Error('보유 칩이 부족합니다')
        this.deps.adjustChips(userId, -amount, `rebuy:${this.config.id}`)
        seat.stack = target
        seat.sittingOut = false
        this.pushLog('system', `${seat.name} 님이 ${amount.toLocaleString()} 칩을 리바이했습니다`)
        this.deps.onLobbyChanged()
        this.scheduleStart(800)
        this.broadcast()
    }

    /* ---------------------------------------------------------------- *
     *  Hand lifecycle
     * ---------------------------------------------------------------- */

    private scheduleStart(delayMs: number): void {
        if (this.hand || this.nextHandTimer) return
        this.nextHandTimer = setTimeout(() => {
            this.nextHandTimer = null
            this.startHand()
        }, delayMs)
    }

    private nextEligibleSeatAfter(seatNo: number | null): number {
        const elig = this.eligible().sort((a, b) => a.seat - b.seat)
        if (elig.length === 0) throw new Error('No eligible players')
        if (seatNo === null) return elig[0].seat
        for (const s of elig) if (s.seat > seatNo) return s.seat
        return elig[0].seat
    }

    private startHand(): void {
        if (this.hand) return
        const elig = this.eligible()
        if (elig.length < 2) {
            this.broadcast()
            return
        }
        this.lastResult = null
        this.buttonSeat = this.nextEligibleSeatAfter(this.buttonSeat)

        const players = elig
            .sort((a, b) => a.seat - b.seat)
            .map((s) => ({ seat: s.seat, playerId: s.userId!, name: s.name, stack: s.stack }))

        const deck = shuffledDeck(mathRandomRng)
        const { state, events } = createHand(
            nanoid(8),
            players,
            this.buttonSeat,
            { smallBlind: this.config.smallBlind, bigBlind: this.config.bigBlind },
            deck,
        )
        this.hand = state
        this.processEvents(events)
        this.deps.onLobbyChanged()

        if (state.street === 'complete') this.onHandComplete()
        else this.startTurnTimer()
        this.broadcast()
    }

    handleAction(userId: string, action: Action): void {
        const seat = this.seatOf(userId)
        const socket = this.members.get(userId)
        if (!this.hand || !seat) {
            socket?.emit('table:error', { message: '지금은 액션할 수 없습니다' })
            return
        }
        if (this.hand.actingSeat !== seat.seat) {
            socket?.emit('table:error', { message: '당신의 차례가 아닙니다' })
            return
        }
        try {
            const { state, events } = applyAction(this.hand, userId, action)
            this.hand = state
            this.clearTurnTimer()
            this.processEvents(events)
            if (state.street === 'complete') this.onHandComplete()
            else this.startTurnTimer()
            this.broadcast()
        } catch (err) {
            socket?.emit('table:error', { message: err instanceof Error ? err.message : '잘못된 액션입니다' })
        }
    }

    private autoActFor(seatNo: number): void {
        if (!this.hand || this.hand.actingSeat !== seatNo) return
        const la = legalActions(this.hand)
        if (!la) return
        const action: Action = la.canCheck ? { type: 'check' } : { type: 'fold' }
        try {
            const { state, events } = applyAction(this.hand, la.playerId, action)
            this.hand = state
            this.clearTurnTimer()
            this.processEvents(events)
            if (state.street === 'complete') this.onHandComplete()
            else this.startTurnTimer()
            this.broadcast()
        } catch {
            /* ignore — state may have moved on */
        }
    }

    private startTurnTimer(): void {
        this.clearTurnTimer()
        if (!this.hand || this.hand.actingSeat === null) return
        const seatNo = this.hand.actingSeat
        this.turnDeadline = Date.now() + this.deps.turnSeconds * 1000
        this.turnTimer = setTimeout(() => this.autoActFor(seatNo), this.deps.turnSeconds * 1000)
    }

    private clearTurnTimer(): void {
        if (this.turnTimer) clearTimeout(this.turnTimer)
        this.turnTimer = null
        this.turnDeadline = null
    }

    private onHandComplete(): void {
        if (!this.hand?.result) return
        this.clearTurnTimer()
        // Copy final stacks from the hand back to the seats.
        for (const hs of this.hand.seats) {
            const seat = this.seats.find((s) => s.seat === hs.seat)
            if (seat) seat.stack = hs.stack
        }

        const result = this.hand.result
        const revealLabel = new Map<number, string>()
        for (const e of result.showdown) revealLabel.set(e.seat, this.handLabel(e.seat))
        this.lastResult = {
            wonByFold: result.wonByFold,
            board: result.board.slice(),
            winners: result.pots.flatMap((pot) =>
                pot.winners.map((w) => {
                    const seat = this.seats.find((s) => s.seat === w.seat)
                    return {
                        seat: w.seat,
                        playerId: w.playerId,
                        name: seat?.name ?? '',
                        amount: w.amount,
                        handLabel: revealLabel.get(w.seat) ?? null,
                    }
                }),
            ),
        }

        const delay = result.wonByFold ? 3000 : 5500
        this.broadcast() // shows revealed cards while the hand object is still set
        this.nextHandTimer = setTimeout(() => {
            this.nextHandTimer = null
            this.hand = null
            // Cash out anyone who asked to leave, and bust-sit players with no chips.
            for (const seat of this.occupied()) {
                if (seat.pendingLeave) this.cashOut(seat, 'leave')
            }
            this.startHand()
            this.broadcast()
        }, delay)
    }

    /* ---------------------------------------------------------------- *
     *  Logging + event translation
     * ---------------------------------------------------------------- */

    private nameOfSeat(seatNo: number): string {
        return this.seats.find((s) => s.seat === seatNo)?.name ?? `좌석 ${seatNo + 1}`
    }

    private handLabel(seatNo: number): string {
        const e = this.hand?.result?.showdown.find((x) => x.seat === seatNo)
        if (!e) return ''
        const hv = e.handValue
        const top = hv.tiebreak[0] ? rankLabel(hv.tiebreak[0]) : ''
        return top ? `${describeHandValue(hv)} (${top})` : describeHandValue(hv)
    }

    private pushLog(kind: GameLogEntry['kind'], text: string, extra: Partial<GameLogEntry> = {}): void {
        const entry: GameLogEntry = { id: nanoid(6), ts: Date.now(), kind, text, ...extra }
        this.emitLog(entry)
    }

    private emitLog(entry: GameLogEntry): void {
        for (const socket of this.members.values()) socket.emit('table:log', entry)
    }

    private processEvents(events: HandEvent[]): void {
        for (const ev of events) {
            switch (ev.type) {
                case 'handStarted':
                    this.pushLog('hand', `새 핸드 시작 — 딜러: ${this.nameOfSeat(ev.button)}`)
                    break
                case 'blindPosted': {
                    const label = ev.blind === 'sb' ? '스몰블라인드' : ev.blind === 'bb' ? '빅블라인드' : '앤티'
                    this.pushLog('blind', `${this.nameOfSeat(ev.seat)} — ${label} ${ev.amount.toLocaleString()}`, {
                        seat: ev.seat,
                        amount: ev.amount,
                    })
                    break
                }
                case 'action': {
                    const verb = actionVerb(ev.action, ev.amount, ev.allIn)
                    this.pushLog('action', `${this.nameOfSeat(ev.seat)} — ${verb}`, {
                        seat: ev.seat,
                        action: ev.action,
                        amount: ev.amount,
                    })
                    break
                }
                case 'streetAdvanced': {
                    const label =
                        ev.street === 'flop' ? '플랍' : ev.street === 'turn' ? '턴' : ev.street === 'river' ? '리버' : ev.street
                    this.pushLog('street', `── ${label} ──`)
                    break
                }
                case 'showdown':
                    this.pushLog('showdown', '쇼다운!')
                    break
                case 'potAwarded': {
                    const names = ev.pot.winners.map((w) => this.nameOfSeat(w.seat)).join(', ')
                    const amount = ev.pot.winners.reduce((a, w) => a + w.amount, 0)
                    this.pushLog('result', `${names} 님이 ${amount.toLocaleString()} 칩 획득`)
                    break
                }
                case 'handComplete':
                case 'holeCardsDealt':
                    break
            }
        }
    }

    chat(userId: string, name: string, message: string): void {
        if (!this.seatOf(userId)) return
        const payload = { playerId: userId, name, message, ts: Date.now() }
        for (const socket of this.members.values()) socket.emit('chat:message', payload)
    }

    /* ---------------------------------------------------------------- *
     *  Views
     * ---------------------------------------------------------------- */

    lobbyInfo(): LobbyTable {
        return {
            id: this.config.id,
            name: this.config.name,
            smallBlind: this.config.smallBlind,
            bigBlind: this.config.bigBlind,
            maxSeats: this.config.maxSeats,
            minBuyIn: this.config.minBuyIn,
            maxBuyIn: this.config.maxBuyIn,
            seatedCount: this.occupied().length,
            inHand: this.hand !== null && this.hand.street !== 'complete',
        }
    }

    private seatView(seat: TableSeat, viewerId: string | null): PublicSeat {
        const hand = this.hand
        const hs = hand?.seats.find((h) => h.seat === seat.seat)
        const isYou = seat.userId !== null && seat.userId === viewerId
        const handComplete = hand?.street === 'complete'
        const revealed = handComplete && (hand?.result?.showdown.some((e) => e.seat === seat.seat) ?? false)

        let status: SeatViewStatus
        if (!seat.userId) status = 'empty'
        else if (hs) status = hs.status
        else if (seat.sittingOut || !seat.connected) status = 'sittingOut'
        else status = 'waiting'

        let cardCount = 0
        let holeCards: PublicSeat['holeCards'] = []
        if (hs && hs.status !== 'folded') {
            cardCount = hs.holeCards.length
            holeCards = isYou || revealed ? hs.holeCards.slice() : hs.holeCards.map(() => null)
        }

        const buttonSeat = hand ? hand.button : this.buttonSeat
        return {
            seat: seat.seat,
            playerId: seat.userId,
            name: seat.userId ? seat.name : null,
            color: seat.userId ? seat.color : null,
            stack: hs ? hs.stack : seat.stack,
            committedThisStreet: hs?.committedThisStreet ?? 0,
            status,
            holeCards,
            cardCount,
            isButton: buttonSeat === seat.seat && seat.userId !== null,
            isActing: hand?.actingSeat === seat.seat,
            isYou,
            sittingOut: seat.sittingOut || (seat.userId !== null && !seat.connected),
            actDeadline: hand?.actingSeat === seat.seat ? this.turnDeadline : null,
            handLabel: revealed ? this.handLabel(seat.seat) : null,
        }
    }

    viewFor(viewerId: string | null): PublicTableState {
        const hand = this.hand
        const frontSum = hand ? hand.seats.reduce((a, s) => a + s.committedThisStreet, 0) : 0
        const yourSeat = viewerId ? (this.seatOf(viewerId)?.seat ?? null) : null
        const yourTurn = hand !== null && yourSeat !== null && hand.actingSeat === yourSeat

        return {
            tableId: this.config.id,
            name: this.config.name,
            config: this.config,
            phase: hand ? hand.street : 'waiting',
            handId: hand?.handId ?? null,
            board: hand?.board.slice() ?? [],
            pots:
                hand?.street === 'complete' && hand.result
                    ? hand.result.pots.map((p) => ({ amount: p.amount, eligible: p.eligible }))
                    : [],
            totalPot: hand ? potTotal(hand) - frontSum : 0,
            seats: this.seats.map((s) => this.seatView(s, viewerId)),
            button: hand ? hand.button : this.buttonSeat,
            actingSeat: hand?.actingSeat ?? null,
            betToCall: hand?.betToCall ?? 0,
            yourSeat,
            yourLegalActions: yourTurn ? legalActions(hand!) : null,
            lastResult: this.lastResult,
        }
    }

    private broadcast(): void {
        for (const [userId, socket] of this.members) {
            socket.emit('table:state', this.viewFor(userId))
        }
    }

    /** Cleanly stop timers (e.g. on shutdown). */
    dispose(): void {
        this.clearTurnTimer()
        if (this.nextHandTimer) clearTimeout(this.nextHandTimer)
        for (const seat of this.seats) if (seat.disconnectTimer) clearTimeout(seat.disconnectTimer)
    }
}

function actionVerb(action: string, amount: number, allIn: boolean): string {
    if (allIn) return `올인 ${amount.toLocaleString()}`
    switch (action) {
        case 'fold':
            return '폴드'
        case 'check':
            return '체크'
        case 'call':
            return `콜 ${amount.toLocaleString()}`
        case 'bet':
            return `벳 ${amount.toLocaleString()}`
        case 'raise':
            return `레이즈 ${amount.toLocaleString()}`
        default:
            return action
    }
}
