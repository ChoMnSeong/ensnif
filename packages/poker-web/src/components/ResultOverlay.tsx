import { fmtChips } from '../lib/format'
import type { ResultOverlayProps } from './props'

export function ResultOverlay({ result }: ResultOverlayProps) {
    const title = result.wonByFold ? '폴드 승 🏆' : '쇼다운 결과 🏆'

    return (
        <div
            style={{
                background: 'rgba(10,20,15,0.82)',
                border: '1px solid var(--ds-palette-primary-600)',
                borderRadius: 'var(--ds-radius-lg)',
                padding: '14px 20px',
                boxShadow: 'var(--ds-shadow-xl)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                minWidth: 200,
                maxWidth: 320,
            }}
        >
            <div
                style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--ds-color-foreground-primary)',
                    textAlign: 'center',
                }}
            >
                {title}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {result.winners.map((winner) => (
                    <div
                        key={winner.seat}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                gap: 12,
                                color: 'var(--ds-palette-primary-300)',
                                fontWeight: 700,
                            }}
                        >
                            <span>{winner.name}</span>
                            <span>+{fmtChips(winner.amount)}</span>
                        </div>
                        {winner.handLabel ? (
                            <span
                                style={{
                                    fontSize: 12,
                                    color: 'var(--ds-color-foreground-muted)',
                                }}
                            >
                                {winner.handLabel}
                            </span>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    )
}
