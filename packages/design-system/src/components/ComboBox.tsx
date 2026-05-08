import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent,
    type ReactNode,
} from 'react'
import { useOutsideClick } from './useOutsideClick.js'
import { Popover } from './Popover.js'
import { IconChevronDown, IconCheck } from './icons.js'
import {
    borderVariantContainerStyle,
    type BorderVariant,
} from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

export type ComboBoxOption = {
    value: string
    label: string
    description?: string
    disabled?: boolean
}

export type ComboBoxProps = {
    options: ComboBoxOption[]
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    placeholder?: string
    emptyMessage?: ReactNode
    disabled?: boolean
    variant?: BorderVariant
    width?: string | number
    style?: CSSProperties
}

export const ComboBox = ({
    options,
    value,
    defaultValue,
    onChange,
    placeholder = 'Select...',
    emptyMessage = '결과 없음',
    disabled,
    variant: variantProp,
    width = 240,
    style,
}: ComboBoxProps) => {
    const variant = useBorderVariant(variantProp)
    const [internal, setInternal] = useState<string | undefined>(defaultValue)
    const current = value ?? internal
    const selected = options.find((o) => o.value === current)

    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [highlight, setHighlight] = useState(0)

    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const popoverRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    useOutsideClick(
        [popoverRef, triggerRef],
        () => {
            setOpen(false)
            setQuery('')
        },
        open,
    )

    useEffect(() => {
        if (open) {
            setHighlight(0)
            const t = setTimeout(() => inputRef.current?.focus(), 10)
            return () => clearTimeout(t)
        }
    }, [open])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return options
        return options.filter(
            (o) =>
                o.label.toLowerCase().includes(q) ||
                o.value.toLowerCase().includes(q),
        )
    }, [options, query])

    const select = (opt: ComboBoxOption) => {
        if (opt.disabled) return
        if (value === undefined) setInternal(opt.value)
        onChange?.(opt.value)
        setOpen(false)
        setQuery('')
    }

    const onKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setHighlight((h) =>
                Math.min(h + 1, Math.max(filtered.length - 1, 0)),
            )
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHighlight((h) => Math.max(h - 1, 0))
        } else if (e.key === 'Enter') {
            e.preventDefault()
            const opt = filtered[highlight]
            if (opt) select(opt)
        } else if (e.key === 'Escape') {
            setOpen(false)
            setQuery('')
        }
    }

    const widthStyle = typeof width === 'number' ? `${width}px` : width

    return (
        <div style={{ width: widthStyle, ...style }}>
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                data-ds-focusable=""
                data-ds-input-variant={variant}
                onClick={() => setOpen((v) => !v)}
                style={{
                    height: '36px',
                    width: '100%',
                    padding: variant === 'underline' ? '0' : '0 14px',
                    color: selected
                        ? 'var(--ds-color-foreground-primary)'
                        : 'var(--ds-color-foreground-tertiary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    ...borderVariantContainerStyle(variant, { surfaceToken: 'inset' }),
                }}
            >
                <span
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {selected?.label ?? placeholder}
                </span>
                <IconChevronDown
                    size={16}
                    style={{
                        color: 'var(--ds-color-foreground-tertiary)',
                        flexShrink: 0,
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: 'transform 120ms ease',
                    }}
                />
            </button>

            <Popover
                open={open}
                triggerRef={triggerRef}
                offset={6}
                matchTriggerWidth
            >
                <div
                    ref={popoverRef}
                    style={{
                        background: 'var(--ds-surface-overlay-background)',
                        backdropFilter:
                            'var(--ds-surface-overlay-backdrop-filter)',
                        border: 'var(--ds-surface-overlay-border)',
                        borderRadius: 'var(--ds-surface-overlay-radius)',
                        boxShadow: 'var(--ds-surface-overlay-shadow)',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            padding: '8px',
                            borderBottom:
                                '1px solid var(--ds-color-border-subtle)',
                        }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                setHighlight(0)
                            }}
                            onKeyDown={onKey}
                            placeholder="검색..."
                            style={{
                                width: '100%',
                                padding: '6px 8px',
                                background: 'var(--ds-color-background-inset)',
                                border: '1px solid var(--ds-color-border-subtle)',
                                borderRadius: 'var(--ds-radius-sm)',
                                color: 'var(--ds-color-foreground-primary)',
                                fontSize: '12px',
                                fontFamily: 'inherit',
                                outline: 'none',
                            }}
                        />
                    </div>

                    <div
                        style={{
                            maxHeight: '240px',
                            overflowY: 'auto',
                            padding: '4px',
                        }}
                    >
                        {filtered.length === 0 ? (
                            <div
                                style={{
                                    padding: '16px',
                                    textAlign: 'center',
                                    fontSize: '12px',
                                    color: 'var(--ds-color-foreground-tertiary)',
                                }}
                            >
                                {emptyMessage}
                            </div>
                        ) : (
                            filtered.map((opt, idx) => {
                                const isSelected = opt.value === current
                                const isHighlighted = idx === highlight
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        disabled={opt.disabled}
                                        onClick={() => select(opt)}
                                        onMouseEnter={() => setHighlight(idx)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            padding: '8px 10px',
                                            gap: '2px',
                                            background:
                                                isHighlighted &&
                                                !opt.disabled
                                                    ? 'var(--ds-color-background-inset)'
                                                    : 'transparent',
                                            color: opt.disabled
                                                ? 'var(--ds-color-foreground-muted)'
                                                : 'var(--ds-color-foreground-primary)',
                                            border: 'none',
                                            borderRadius:
                                                'var(--ds-radius-sm)',
                                            cursor: opt.disabled
                                                ? 'not-allowed'
                                                : 'pointer',
                                            textAlign: 'left',
                                            fontSize: '13px',
                                            fontFamily: 'inherit',
                                            fontWeight: isSelected
                                                ? 600
                                                : 500,
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                width: '100%',
                                            }}
                                        >
                                            {isSelected && (
                                                <IconCheck
                                                    size={14}
                                                    style={{
                                                        color: 'var(--ds-color-accent-background)',
                                                    }}
                                                />
                                            )}
                                            <span>{opt.label}</span>
                                        </span>
                                        {opt.description && (
                                            <span
                                                style={{
                                                    fontSize: '11px',
                                                    color: 'var(--ds-color-foreground-tertiary)',
                                                    paddingLeft: isSelected
                                                        ? '20px'
                                                        : 0,
                                                }}
                                            >
                                                {opt.description}
                                            </span>
                                        )}
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>
            </Popover>
        </div>
    )
}
