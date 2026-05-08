import {
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from 'react'
import { useOutsideClick } from './useOutsideClick.js'
import { Popover } from './Popover.js'
import {
    IconCalendar,
    IconChevronLeft,
    IconChevronRight,
} from './icons.js'
import {
    borderVariantContainerStyle,
    type BorderVariant,
} from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

export type DatePickerProps = {
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    placeholder?: string
    disabled?: boolean
    variant?: BorderVariant
    locale?: string
    weekStartsOn?: 0 | 1
    style?: CSSProperties
}

const pad = (n: number) => String(n).padStart(2, '0')
const formatISO = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const parseISO = (s: string | undefined): Date | null => {
    if (!s) return null
    const d = new Date(s)
    return Number.isNaN(d.getTime()) ? null : d
}

const buildMonthGrid = (
    year: number,
    month: number,
    weekStartsOn: 0 | 1,
): Date[] => {
    const first = new Date(year, month, 1)
    const startWeekday = (first.getDay() - weekStartsOn + 7) % 7
    const start = new Date(year, month, 1 - startWeekday)
    const days: Date[] = []
    for (let i = 0; i < 42; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        days.push(d)
    }
    return days
}

export const DatePicker = ({
    value,
    defaultValue,
    onChange,
    placeholder = 'YYYY-MM-DD',
    disabled,
    variant: variantProp,
    locale = 'ko-KR',
    weekStartsOn = 0,
    style,
}: DatePickerProps) => {
    const variant = useBorderVariant(variantProp)
    const [internal, setInternal] = useState<string | undefined>(defaultValue)
    const current = value ?? internal
    const selectedDate = parseISO(current)

    const [open, setOpen] = useState(false)
    const initial = selectedDate ?? new Date()
    const [view, setView] = useState({
        year: initial.getFullYear(),
        month: initial.getMonth(),
    })

    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const popoverRef = useRef<HTMLDivElement | null>(null)
    useOutsideClick(
        [popoverRef, triggerRef],
        () => setOpen(false),
        open,
    )

    const days = useMemo(
        () => buildMonthGrid(view.year, view.month, weekStartsOn),
        [view, weekStartsOn],
    )

    const weekdays = useMemo(() => {
        const base = new Date(2024, 0, weekStartsOn === 1 ? 1 : 7)
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(base)
            d.setDate(base.getDate() + i)
            return d.toLocaleDateString(locale, { weekday: 'narrow' })
        })
    }, [locale, weekStartsOn])

    const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString(
        locale,
        { year: 'numeric', month: 'long' },
    )

    const select = (d: Date) => {
        const iso = formatISO(d)
        if (value === undefined) setInternal(iso)
        onChange?.(iso)
        setOpen(false)
    }

    const today = new Date()
    const todayKey = formatISO(today)

    return (
        <div style={{ display: 'inline-block', ...style }}>
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                data-ds-focusable=""
                data-ds-input-variant={variant}
                onClick={() => setOpen((v) => !v)}
                style={{
                    height: '36px',
                    minWidth: '180px',
                    padding: variant === 'underline' ? '0' : '0 14px',
                    color: current
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
                <span>{current ?? placeholder}</span>
                <IconCalendar
                    size={14}
                    style={{
                        color: 'var(--ds-color-foreground-tertiary)',
                        flexShrink: 0,
                    }}
                />
            </button>

            <Popover
                open={open}
                triggerRef={triggerRef}
                offset={6}
                minWidth={280}
            >
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
                        color: 'var(--ds-surface-overlay-color)',
                    }}
                >
                    <header
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setView((v) =>
                                    v.month === 0
                                        ? { year: v.year - 1, month: 11 }
                                        : { year: v.year, month: v.month - 1 },
                                )
                            }
                            style={navButtonStyle}
                            aria-label="Previous month"
                        >
                            <IconChevronLeft size={14} />
                        </button>
                        <div
                            style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--ds-color-foreground-primary)',
                            }}
                        >
                            {monthLabel}
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                setView((v) =>
                                    v.month === 11
                                        ? { year: v.year + 1, month: 0 }
                                        : { year: v.year, month: v.month + 1 },
                                )
                            }
                            style={navButtonStyle}
                            aria-label="Next month"
                        >
                            <IconChevronRight size={14} />
                        </button>
                    </header>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)',
                            gap: '2px',
                            marginBottom: '4px',
                        }}
                    >
                        {weekdays.map((w) => (
                            <div
                                key={w}
                                style={{
                                    textAlign: 'center',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    padding: '4px 0',
                                    color: 'var(--ds-color-foreground-tertiary)',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {w}
                            </div>
                        ))}
                    </div>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)',
                            gap: '2px',
                        }}
                    >
                        {days.map((d) => {
                            const inMonth = d.getMonth() === view.month
                            const iso = formatISO(d)
                            const selected = iso === current
                            const isToday = iso === todayKey
                            return (
                                <button
                                    key={iso}
                                    type="button"
                                    onClick={() => select(d)}
                                    style={{
                                        aspectRatio: '1',
                                        border: isToday && !selected
                                            ? '1px solid var(--ds-color-accent-background)'
                                            : 'none',
                                        background: selected
                                            ? 'var(--ds-color-accent-background)'
                                            : 'transparent',
                                        color: selected
                                            ? 'var(--ds-color-accent-color)'
                                            : inMonth
                                              ? 'var(--ds-color-foreground-primary)'
                                              : 'var(--ds-color-foreground-muted)',
                                        fontSize: '12px',
                                        fontWeight: selected ? 700 : 500,
                                        borderRadius: 'var(--ds-radius-sm)',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'all 80ms ease',
                                    }}
                                >
                                    {d.getDate()}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </Popover>
        </div>
    )
}

const navButtonStyle: CSSProperties = {
    width: '28px',
    height: '28px',
    background: 'transparent',
    border: '1px solid var(--ds-color-border-subtle)',
    borderRadius: 'var(--ds-radius-sm)',
    color: 'var(--ds-color-foreground-secondary)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
}
