import { useCallback, useState, type CSSProperties, type Ref } from 'react'
import { mergeStyles } from './types.js'

export type SliderProps = {
    value?: number
    defaultValue?: number
    onChange?: (value: number) => void
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    showLabel?: boolean
    formatValue?: (n: number) => string
    fullWidth?: boolean
    style?: CSSProperties
    ref?: Ref<HTMLInputElement>
}

export const Slider = ({
    value: controlled,
    defaultValue = 0,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    showLabel,
    formatValue = (n) => String(n),
    fullWidth = true,
    style,
    ref,
}: SliderProps) => {
    const [internal, setInternal] = useState(defaultValue)
    const value = controlled ?? internal
    const pct = ((value - min) / (max - min)) * 100

    const update = useCallback(
        (n: number) => {
            if (controlled === undefined) setInternal(n)
            onChange?.(n)
        },
        [controlled, onChange],
    )

    return (
        <div
            style={mergeStyles(
                {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    width: fullWidth ? '100%' : 'auto',
                    minWidth: '200px',
                    opacity: disabled ? 0.5 : 1,
                },
                style,
            )}
        >
            {showLabel && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        color: 'var(--ds-color-foreground-tertiary)',
                        fontFamily: 'var(--ds-typography-fontFamily-mono)',
                    }}
                >
                    <span>{formatValue(min)}</span>
                    <span
                        style={{
                            color: 'var(--ds-color-foreground-primary)',
                            fontWeight: 600,
                        }}
                    >
                        {formatValue(value)}
                    </span>
                    <span>{formatValue(max)}</span>
                </div>
            )}
            <div style={{ position: 'relative', height: '20px' }}>
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'var(--ds-color-background-inset)',
                        borderRadius: '9999px',
                        transform: 'translateY(-50%)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        height: '4px',
                        width: `${pct}%`,
                        background: 'var(--ds-color-accent-background)',
                        borderRadius: '9999px',
                        transform: 'translateY(-50%)',
                    }}
                />
                <input
                    ref={ref}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    disabled={disabled}
                    onChange={(e) => update(Number(e.target.value))}
                    data-ds-focusable=""
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        margin: 0,
                    }}
                />
                <span
                    aria-hidden
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: `${pct}%`,
                        width: '16px',
                        height: '16px',
                        background: 'var(--ds-color-accent-color)',
                        border: '2px solid var(--ds-color-accent-background)',
                        borderRadius: '50%',
                        boxShadow: 'var(--ds-shadow-sm)',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                    }}
                />
            </div>
        </div>
    )
}
