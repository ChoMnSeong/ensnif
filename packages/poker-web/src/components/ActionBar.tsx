import { useEffect, useState } from 'react'
import { Button } from '@ensnif/design-system'
import { fmtChips } from '../lib/format'
import type { ActionBarProps } from './props'

const clamp = (value: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, value))

/** Hero action controls (fold / check / call / bet / raise) in a centered, wrapping row. */
export function ActionBar({ legal, betToCall, pot, bigBlind, onAction, disabled }: ActionBarProps) {
    const [amount, setAmount] = useState(legal.minRaiseTo)

    useEffect(() => {
        setAmount((current) => clamp(current, legal.minRaiseTo, legal.maxRaiseTo))
    }, [legal.minRaiseTo, legal.maxRaiseTo])

    const toStep = (value: number): number =>
        clamp(Math.round(value / bigBlind) * bigBlind, legal.minRaiseTo, legal.maxRaiseTo)

    const submitRaise = () => {
        if (amount >= legal.maxRaiseTo) {
            onAction({ type: 'allIn' })
        } else {
            onAction({ type: legal.isOpeningBet ? 'bet' : 'raise', amount })
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
            }}
        >
            {legal.canFold && (
                <Button variant="danger" disabled={disabled} onClick={() => onAction({ type: 'fold' })}>
                    폴드
                </Button>
            )}

            {legal.canCheck ? (
                <Button variant="secondary" disabled={disabled} onClick={() => onAction({ type: 'check' })}>
                    체크
                </Button>
            ) : (
                legal.canCall && (
                    <Button variant="primary" disabled={disabled} onClick={() => onAction({ type: 'call' })}>
                        콜 {fmtChips(legal.callAmount)}
                    </Button>
                )
            )}

            {legal.canRaise && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        padding: 12,
                        borderRadius: 'var(--ds-radius-md)',
                        background: 'var(--ds-color-background-card)',
                        border: '1px solid var(--ds-color-border-default)',
                    }}
                >
                    <div
                        style={{
                            fontVariantNumeric: 'tabular-nums',
                            fontWeight: 600,
                            color: 'var(--ds-color-foreground-primary)',
                        }}
                    >
                        {fmtChips(amount)}
                    </div>

                    <input
                        type="range"
                        min={legal.minRaiseTo}
                        max={legal.maxRaiseTo}
                        step={bigBlind}
                        value={amount}
                        disabled={disabled}
                        onChange={(e) => setAmount(clamp(Number(e.target.value), legal.minRaiseTo, legal.maxRaiseTo))}
                        style={{ width: 200, accentColor: 'var(--ds-palette-primary-500)' }}
                    />

                    <div style={{ display: 'flex', gap: 6 }}>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={disabled}
                            onClick={() => setAmount(toStep(betToCall + Math.round(pot / 2)))}
                        >
                            ½ 팟
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={disabled}
                            onClick={() => setAmount(toStep(betToCall + pot))}
                        >
                            팟
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={disabled}
                            onClick={() => setAmount(legal.maxRaiseTo)}
                        >
                            올인
                        </Button>
                    </div>

                    <Button variant="primary" fullWidth disabled={disabled} onClick={submitRaise}>
                        {legal.isOpeningBet ? '벳 ' : '레이즈 '}
                        {fmtChips(amount)}
                    </Button>
                </div>
            )}
        </div>
    )
}
