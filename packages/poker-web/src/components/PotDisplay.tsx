import { fmtChips } from '../lib/format'
import { CHIP } from '../theme'
import type { PotDisplayProps } from './props'

/** Compact centered pot indicator with optional side-pot breakdown. */
export function PotDisplay({ totalPot, pots }: PotDisplayProps) {
    const hasPots = !!pots && pots.length > 0
    if (totalPot <= 0 && !hasPots) return null

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
            }}
        >
            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid var(--ds-color-border-subtle)',
                    borderRadius: 'var(--ds-radius-full)',
                    padding: '4px 12px',
                    fontWeight: 700,
                    color: 'var(--ds-color-foreground-primary)',
                    whiteSpace: 'nowrap',
                }}
            >
                <span aria-hidden="true" style={{ color: CHIP.pot, lineHeight: 1 }}>
                    ●
                </span>
                <span>{`POT ${fmtChips(totalPot)}`}</span>
            </div>
            {hasPots && pots.length > 1
                ? pots.map((p, i) => (
                      <span
                          key={i}
                          style={{
                              fontSize: 12,
                              color: 'var(--ds-color-foreground-muted)',
                          }}
                      >
                          {`사이드 ${fmtChips(p.amount)}`}
                      </span>
                  ))
                : null}
        </div>
    )
}
