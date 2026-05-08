import {
    useRef,
    useState,
    type CSSProperties,
} from 'react'
import { Popover } from './Popover.js'
import { useOutsideClick } from './useOutsideClick.js'
import { mergeStyles } from './types.js'

export type ColorPickerProps = {
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    swatches?: string[]
    disabled?: boolean
    style?: CSSProperties
}

const DEFAULT_SWATCHES = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#14b8a6',
    '#3b82f6',
    '#6366f1',
    '#a35def',
    '#ec4899',
    '#71717a',
    '#000000',
    '#ffffff',
]

const isValidHex = (s: string): boolean =>
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s)

const normalizeHex = (s: string): string => {
    let h = s.trim()
    if (!h.startsWith('#')) h = `#${h}`
    if (/^#[0-9a-fA-F]{3}$/.test(h)) {
        h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`
    }
    return h.toLowerCase()
}

export const ColorPicker = ({
    value: controlled,
    defaultValue = '#a35def',
    onChange,
    swatches = DEFAULT_SWATCHES,
    disabled,
    style,
}: ColorPickerProps) => {
    const [internal, setInternal] = useState(defaultValue)
    const value = controlled ?? internal
    const [open, setOpen] = useState(false)
    const [draft, setDraft] = useState(value)

    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const popoverRef = useRef<HTMLDivElement | null>(null)
    useOutsideClick([popoverRef, triggerRef], () => setOpen(false), open)

    const apply = (next: string) => {
        if (!isValidHex(next)) return
        const norm = normalizeHex(next)
        if (controlled === undefined) setInternal(norm)
        onChange?.(norm)
    }

    return (
        <div style={{ display: 'inline-block', ...style }}>
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                data-ds-focusable=""
                onClick={() => {
                    setOpen((v) => !v)
                    setDraft(value)
                }}
                style={{
                    height: '36px',
                    padding: '0 12px',
                    background: 'var(--ds-surface-inset-background)',
                    border: 'var(--ds-surface-inset-border)',
                    borderRadius: 'var(--ds-surface-inset-radius)',
                    boxShadow: 'var(--ds-surface-inset-shadow)',
                    color: 'var(--ds-color-foreground-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                }}
            >
                <span
                    aria-hidden
                    style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: 'var(--ds-radius-sm)',
                        background: value,
                        border: '1px solid var(--ds-color-border-subtle)',
                        flexShrink: 0,
                    }}
                />
                <span
                    style={{
                        fontFamily: 'var(--ds-typography-fontFamily-mono)',
                        fontSize: '12px',
                    }}
                >
                    {value}
                </span>
            </button>

            <Popover open={open} triggerRef={triggerRef} offset={6} minWidth={232}>
                <div
                    ref={popoverRef}
                    style={{
                        padding: '12px',
                        background: 'var(--ds-surface-overlay-background)',
                        backdropFilter:
                            'var(--ds-surface-overlay-backdrop-filter)',
                        border: 'var(--ds-surface-overlay-border)',
                        borderRadius: 'var(--ds-surface-overlay-radius)',
                        boxShadow: 'var(--ds-surface-overlay-shadow)',
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(6, 1fr)',
                            gap: '6px',
                            marginBottom: '12px',
                        }}
                    >
                        {swatches.map((c) => {
                            const isSelected = c.toLowerCase() === value.toLowerCase()
                            return (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => {
                                        apply(c)
                                        setDraft(c)
                                    }}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        background: c,
                                        border: isSelected
                                            ? `2px solid var(--ds-color-accent-background)`
                                            : '1px solid var(--ds-color-border-subtle)',
                                        borderRadius: 'var(--ds-radius-sm)',
                                        cursor: 'pointer',
                                        padding: 0,
                                    }}
                                    aria-label={c}
                                />
                            )
                        })}
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            gap: '6px',
                            alignItems: 'center',
                        }}
                    >
                        <input
                            type="color"
                            value={value}
                            onChange={(e) => {
                                apply(e.target.value)
                                setDraft(e.target.value)
                            }}
                            style={{
                                width: '36px',
                                height: '32px',
                                padding: 0,
                                border: '1px solid var(--ds-color-border-subtle)',
                                borderRadius: 'var(--ds-radius-sm)',
                                background: 'transparent',
                                cursor: 'pointer',
                            }}
                        />
                        <input
                            type="text"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onBlur={() => apply(draft)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') apply(draft)
                            }}
                            style={{
                                flex: 1,
                                height: '32px',
                                padding: '0 8px',
                                background:
                                    'var(--ds-color-background-inset)',
                                border: '1px solid var(--ds-color-border-subtle)',
                                borderRadius: 'var(--ds-radius-sm)',
                                color: 'var(--ds-color-foreground-primary)',
                                fontSize: '12px',
                                fontFamily:
                                    'var(--ds-typography-fontFamily-mono)',
                                outline: 'none',
                            }}
                        />
                    </div>
                </div>
            </Popover>
        </div>
    )
}
