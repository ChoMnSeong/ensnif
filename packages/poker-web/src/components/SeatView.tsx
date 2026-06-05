import { useEffect, useState, type CSSProperties } from 'react'
import { Badge } from '@ensnif/design-system'
import { CardView } from './CardView'
import { fmtChips, initialOf } from '../lib/format'
import { CHIP } from '../theme'
import type { SeatViewProps } from './props'

const POD_WIDTH = 130
/** Assumed maximum think time used to scale the turn-timer bar. */
const TURN_CAP_MS = 30_000

const podBase: CSSProperties = {
    position: 'relative',
    width: POD_WIDTH,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    fontFamily: 'inherit',
}

export function SeatView({ seat, isHero, bigBlind }: SeatViewProps) {
    void bigBlind

    const [now, setNow] = useState(() => Date.now())

    const ticking = seat.isActing && seat.actDeadline != null
    useEffect(() => {
        if (!ticking) return
        const id = window.setInterval(() => setNow(Date.now()), 250)
        return () => window.clearInterval(id)
    }, [ticking])

    if (seat.status === 'empty') {
        return (
            <div style={podBase}>
                <div
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: 'var(--ds-radius-full)',
                        border: '2px dashed var(--ds-color-border-subtle)',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'var(--ds-color-foreground-muted)',
                        fontSize: 12,
                    }}
                >
                    빈 자리
                </div>
            </div>
        )
    }

    const cardSize = isHero ? 'md' : 'sm'
    const folded = seat.status === 'folded'

    const infoBox: CSSProperties = {
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--ds-color-background-card)',
        border: '1px solid var(--ds-color-border-default)',
        borderRadius: 'var(--ds-radius-md)',
        padding: '6px 10px',
        boxShadow: seat.isActing ? '0 0 0 2px var(--ds-palette-primary-500)' : undefined,
    }

    // Turn timer.
    let timerPct = 0
    let timerLow = false
    if (seat.isActing && seat.actDeadline != null) {
        const remaining = Math.max(0, seat.actDeadline - now)
        timerPct = Math.min(100, Math.max(0, (remaining / TURN_CAP_MS) * 100))
        timerLow = remaining < 5_000
    }

    return (
        <div style={{ ...podBase, opacity: folded ? 0.5 : 1 }}>
            {/* Dealer button */}
            {seat.isButton && (
                <div
                    style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        width: 24,
                        height: 24,
                        borderRadius: 'var(--ds-radius-full)',
                        background: '#ffffff',
                        color: '#111111',
                        border: '1px solid var(--ds-color-border-strong)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 12,
                        fontWeight: 800,
                        boxShadow: 'var(--ds-shadow-sm)',
                        zIndex: 2,
                    }}
                >
                    D
                </div>
            )}

            {/* Cards row */}
            <div style={{ display: 'flex', gap: 4, minHeight: 1 }}>
                {[0, 1].map((i) => {
                    const c = seat.holeCards[i]
                    if (c) return <CardView key={i} card={c} size={cardSize} />
                    if (seat.cardCount > 0)
                        return <CardView key={i} card={null} hidden size={cardSize} />
                    return null
                })}
            </div>

            {/* Bet chips */}
            {seat.committedThisStreet > 0 && (
                <div
                    style={{
                        background: CHIP.bet,
                        color: '#111111',
                        borderRadius: 'var(--ds-radius-full)',
                        padding: '2px 8px',
                        fontSize: 11,
                        fontWeight: 700,
                        boxShadow: 'var(--ds-shadow-sm)',
                    }}
                >
                    {fmtChips(seat.committedThisStreet)}
                </div>
            )}

            {/* Info panel */}
            <div style={infoBox}>
                <div
                    style={{
                        flexShrink: 0,
                        width: 28,
                        height: 28,
                        borderRadius: 'var(--ds-radius-full)',
                        background: seat.color ?? '#555',
                        color: '#ffffff',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 13,
                        fontWeight: 700,
                    }}
                >
                    {initialOf(seat.name)}
                </div>
                <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--ds-color-foreground-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {seat.name ?? '플레이어'}
                    </span>
                    <span
                        style={{
                            fontSize: 11,
                            color: 'var(--ds-color-foreground-secondary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        🪙 {fmtChips(seat.stack)}
                    </span>
                </div>

                {/* Turn timer bar */}
                {seat.isActing && seat.actDeadline != null && (
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: -1,
                            height: 3,
                            background: 'var(--ds-color-background-inset)',
                            borderBottomLeftRadius: 'var(--ds-radius-md)',
                            borderBottomRightRadius: 'var(--ds-radius-md)',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                width: `${timerPct}%`,
                                height: '100%',
                                background: timerLow
                                    ? 'var(--ds-color-state-danger)'
                                    : 'var(--ds-palette-primary-500)',
                                transition: 'width 0.25s linear',
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Badges + showdown label */}
            {(seat.status === 'allIn' || seat.sittingOut || seat.handLabel) && (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 4,
                    }}
                >
                    {seat.status === 'allIn' && (
                        <Badge tone="warning" size="sm">
                            올인
                        </Badge>
                    )}
                    {seat.sittingOut && (
                        <Badge tone="default" size="sm">
                            대기
                        </Badge>
                    )}
                    {seat.handLabel && (
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: 'var(--ds-palette-primary-300)',
                            }}
                        >
                            {seat.handLabel}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
