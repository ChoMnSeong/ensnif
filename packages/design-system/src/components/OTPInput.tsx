import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type ClipboardEvent,
    type KeyboardEvent,
} from 'react'
import { mergeStyles } from './types.js'
import {
    borderVariantContainerStyle,
    type BorderVariant,
} from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

export type OTPInputProps = {
    length?: number
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    onComplete?: (value: string) => void
    type?: 'numeric' | 'alphanumeric'
    autoFocus?: boolean
    disabled?: boolean
    variant?: BorderVariant
    style?: CSSProperties
}

export const OTPInput = ({
    length = 6,
    value: controlled,
    defaultValue = '',
    onChange,
    onComplete,
    type = 'numeric',
    autoFocus,
    disabled,
    variant: variantProp,
    style,
}: OTPInputProps) => {
    const variant = useBorderVariant(variantProp)
    const [internal, setInternal] = useState(defaultValue.slice(0, length))
    const value = (controlled ?? internal).slice(0, length)
    const refs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        if (autoFocus) refs.current[0]?.focus()
    }, [autoFocus])

    const update = (next: string) => {
        const trimmed = next.slice(0, length)
        if (controlled === undefined) setInternal(trimmed)
        onChange?.(trimmed)
        if (trimmed.length === length) onComplete?.(trimmed)
    }

    const isValid = (ch: string): boolean => {
        if (type === 'numeric') return /^\d$/.test(ch)
        return /^[0-9a-zA-Z]$/.test(ch)
    }

    const onCharChange = (idx: number, raw: string) => {
        const ch = raw.slice(-1)
        if (ch && !isValid(ch)) return
        const arr = value.padEnd(length, ' ').split('')
        arr[idx] = ch || ' '
        const next = arr.join('').replace(/\s+$/, '')
        update(next)
        if (ch && idx < length - 1) {
            refs.current[idx + 1]?.focus()
        }
    }

    const onKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !value[idx] && idx > 0) {
            refs.current[idx - 1]?.focus()
        } else if (e.key === 'ArrowLeft' && idx > 0) {
            refs.current[idx - 1]?.focus()
        } else if (e.key === 'ArrowRight' && idx < length - 1) {
            refs.current[idx + 1]?.focus()
        }
    }

    const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text').trim()
        const filtered = text
            .split('')
            .filter(isValid)
            .slice(0, length)
            .join('')
        if (filtered) {
            update(filtered)
            const next = Math.min(filtered.length, length - 1)
            refs.current[next]?.focus()
        }
    }

    const cellSize = 40
    const cellStyle: CSSProperties = {
        width: `${cellSize}px`,
        height: `${cellSize + 6}px`,
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 700,
        fontFamily: 'var(--ds-typography-fontFamily-mono)',
        color: 'var(--ds-color-foreground-primary)',
        outline: 'none',
        ...borderVariantContainerStyle(variant, { surfaceToken: 'inset' }),
    }

    return (
        <div
            style={mergeStyles(
                {
                    display: 'inline-flex',
                    gap: '6px',
                    opacity: disabled ? 0.5 : 1,
                },
                style,
            )}
        >
            {Array.from({ length }, (_, idx) => (
                <input
                    key={idx}
                    ref={(el) => {
                        refs.current[idx] = el
                    }}
                    type="text"
                    inputMode={type === 'numeric' ? 'numeric' : 'text'}
                    maxLength={1}
                    value={value[idx] ?? ''}
                    disabled={disabled}
                    onChange={(e) => onCharChange(idx, e.target.value)}
                    onKeyDown={(e) => onKeyDown(idx, e)}
                    onPaste={onPaste}
                    onFocus={(e) => e.currentTarget.select()}
                    data-ds-focusable=""
                    data-ds-input-variant={variant}
                    style={cellStyle}
                />
            ))}
        </div>
    )
}
