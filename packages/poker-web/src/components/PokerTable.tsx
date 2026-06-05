import type { CSSProperties } from 'react'
import { FELT } from '../theme'
import type { PokerTableProps } from './props'
import { SeatView } from './SeatView'
import { CommunityCards } from './CommunityCards'
import { PotDisplay } from './PotDisplay'
import { ResultOverlay } from './ResultOverlay'

const OVAL_RADIUS = '48% / 60%'

const containerStyle: CSSProperties = {
    position: 'relative',
    width: 'min(900px, 96%)',
    aspectRatio: '16 / 10',
    margin: '0 auto',
}

const railStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: FELT.rail,
    borderRadius: OVAL_RADIUS,
    boxShadow: 'var(--ds-shadow-2xl)',
    padding: 18,
    boxSizing: 'border-box',
}

const feltStyle: CSSProperties = {
    position: 'absolute',
    inset: 18,
    background: `radial-gradient(circle at 50% 40%, ${FELT.table}, ${FELT.tableDark})`,
    border: `2px solid ${FELT.railEdge}`,
    borderRadius: OVAL_RADIUS,
    boxSizing: 'border-box',
}

const centerStackStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
    zIndex: 2,
    pointerEvents: 'none',
}

const overlayStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 20,
}

export function PokerTable({ state }: PokerTableProps) {
    const seats = state.seats
    const N = seats.length
    const heroIdx = state.yourSeat != null ? seats.findIndex((s) => s.seat === state.yourSeat) : 0

    const cx = 50
    const cy = 50
    const rx = 46
    const ry = 44

    const showResult =
        state.lastResult != null &&
        (state.phase === 'complete' || state.phase === 'showdown' || state.phase === 'waiting')

    return (
        <div style={containerStyle}>
            <div style={railStyle}>
                <div style={feltStyle} />
            </div>

            <div style={centerStackStyle}>
                <PotDisplay totalPot={state.totalPot} pots={state.pots} />
                <CommunityCards board={state.board} />
            </div>

            {seats.map((seat, i) => {
                const baseIdx = heroIdx >= 0 ? heroIdx : 0
                const rel = ((i - baseIdx) + N) % N
                const angle = Math.PI / 2 + (rel * 2 * Math.PI) / N
                const left = cx + rx * Math.cos(angle)
                const top = cy + ry * Math.sin(angle)
                return (
                    <div
                        key={seat.seat}
                        style={{
                            position: 'absolute',
                            left: `${left}%`,
                            top: `${top}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 5,
                        }}
                    >
                        <SeatView seat={seat} isHero={seat.isYou} bigBlind={state.config.bigBlind} />
                    </div>
                )
            })}

            {showResult && state.lastResult != null && (
                <div style={overlayStyle}>
                    <ResultOverlay result={state.lastResult} />
                </div>
            )}
        </div>
    )
}
