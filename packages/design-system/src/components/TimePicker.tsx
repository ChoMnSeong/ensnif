import { useState, type CSSProperties } from 'react'
import { mergeStyles } from './types.js'
import {
    borderVariantContainerStyle,
    type BorderVariant,
} from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

export type TimePickerProps = {
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    minuteStep?: 1 | 5 | 10 | 15 | 30
    use24Hours?: boolean
    disabled?: boolean
    variant?: BorderVariant
    style?: CSSProperties
}

const pad = (n: number) => String(n).padStart(2, '0')

const parse = (s: string | undefined): { h: number; m: number } | null => {
    if (!s) return null
    const m = /^(\d{1,2}):(\d{1,2})$/.exec(s)
    if (!m) return null
    const h = Number(m[1])
    const min = Number(m[2])
    if (h < 0 || h > 23 || min < 0 || min > 59) return null
    return { h, m: min }
}

export const TimePicker = ({
    value: controlled,
    defaultValue = '09:00',
    onChange,
    minuteStep = 5,
    use24Hours = true,
    disabled,
    variant: variantProp,
    style,
}: TimePickerProps) => {
    const variant = useBorderVariant(variantProp)
    const [internal, setInternal] = useState(defaultValue)
    const value = controlled ?? internal
    const parsed = parse(value) ?? { h: 9, m: 0 }

    const update = (h: number, m: number) => {
        const v = `${pad(h)}:${pad(m)}`
        if (controlled === undefined) setInternal(v)
        onChange?.(v)
    }

    const onHourChange = (raw: string) => {
        const n = Number(raw)
        if (Number.isNaN(n)) return
        const h = Math.max(0, Math.min(23, n))
        update(h, parsed.m)
    }
    const onMinuteChange = (raw: string) => {
        const n = Number(raw)
        if (Number.isNaN(n)) return
        const m = Math.max(0, Math.min(59, n))
        update(parsed.h, m)
    }

    const wrapper: CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        height: '36px',
        padding: variant === 'underline' ? '0' : '0 12px',
        opacity: disabled ? 0.5 : 1,
        ...borderVariantContainerStyle(variant, { surfaceToken: 'inset' }),
    }

    const inputStyle: CSSProperties = {
        width: '32px',
        minWidth: '32px',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        textAlign: 'center',
        fontSize: '13px',
        fontFamily: 'var(--ds-typography-fontFamily-mono)',
        color: 'var(--ds-color-foreground-primary)',
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
    }

    const display = use24Hours
        ? null
        : parsed.h >= 12
          ? 'PM'
          : 'AM'

    return (
        <div
            data-ds-focus-within=""
            data-ds-input-variant={variant}
            data-ds-numberinput=""
            style={mergeStyles(wrapper, style)}
        >
            <input
                type="number"
                min={0}
                max={23}
                value={pad(parsed.h)}
                disabled={disabled}
                onChange={(e) => onHourChange(e.target.value)}
                style={inputStyle}
            />
            <span
                aria-hidden
                style={{
                    color: 'var(--ds-color-foreground-tertiary)',
                    fontWeight: 700,
                    fontSize: '13px',
                    width: '8px',
                    textAlign: 'center',
                    display: 'inline-block',
                    flexShrink: 0,
                }}
            >
                :
            </span>
            <input
                type="number"
                min={0}
                max={59}
                step={minuteStep}
                value={pad(parsed.m)}
                disabled={disabled}
                onChange={(e) => onMinuteChange(e.target.value)}
                style={inputStyle}
            />
            {display && (
                <span
                    style={{
                        marginLeft: '8px',
                        padding: '2px 6px',
                        background: 'var(--ds-color-background-inset)',
                        color: 'var(--ds-color-foreground-secondary)',
                        borderRadius: 'var(--ds-radius-sm)',
                        fontSize: '11px',
                        fontWeight: 600,
                    }}
                >
                    {display}
                </span>
            )}
        </div>
    )
}
