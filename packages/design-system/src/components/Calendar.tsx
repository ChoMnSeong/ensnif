import { useMemo, useState, type CSSProperties } from 'react'
import { mergeStyles } from './types.js'
import { IconChevronLeft, IconChevronRight } from './icons.js'

export type CalendarProps = {
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    locale?: string
    weekStartsOn?: 0 | 1
    minDate?: string
    maxDate?: string
    markedDates?: string[]
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

const buildGrid = (year: number, month: number, weekStartsOn: 0 | 1): Date[] => {
    const first = new Date(year, month, 1)
    const startWeekday = (first.getDay() - weekStartsOn + 7) % 7
    const start = new Date(year, month, 1 - startWeekday)
    return Array.from({ length: 42 }, (_, i) => {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        return d
    })
}

export const Calendar = ({
    value,
    defaultValue,
    onChange,
    locale = 'ko-KR',
    weekStartsOn = 0,
    minDate,
    maxDate,
    markedDates = [],
    style,
}: CalendarProps) => {
    const [internal, setInternal] = useState<string | undefined>(defaultValue)
    const current = value ?? internal
    const selectedDate = parseISO(current)

    const initial = selectedDate ?? new Date()
    const [view, setView] = useState({
        year: initial.getFullYear(),
        month: initial.getMonth(),
    })

    const days = useMemo(
        () => buildGrid(view.year, view.month, weekStartsOn),
        [view, weekStartsOn],
    )

    const weekdays = useMemo(() => {
        const base = new Date(2024, 0, weekStartsOn === 1 ? 1 : 7)
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(base)
            d.setDate(base.getDate() + i)
            return d.toLocaleDateString(locale, { weekday: 'short' })
        })
    }, [locale, weekStartsOn])

    const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString(
        locale,
        { year: 'numeric', month: 'long' },
    )

    const select = (d: Date) => {
        const iso = formatISO(d)
        if (minDate && iso < minDate) return
        if (maxDate && iso > maxDate) return
        if (value === undefined) setInternal(iso)
        onChange?.(iso)
    }

    const today = formatISO(new Date())
    const markedSet = new Set(markedDates)

    return (
        <div
            style={mergeStyles(
                {
                    background: 'var(--ds-color-background-card)',
                    border: '1px solid var(--ds-color-border-subtle)',
                    borderRadius: 'var(--ds-radius-lg)',
                    padding: '16px',
                    display: 'inline-block',
                    minWidth: '300px',
                },
                style,
            )}
        >
            <header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                }}
            >
                <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() =>
                        setView((v) =>
                            v.month === 0
                                ? { year: v.year - 1, month: 11 }
                                : { year: v.year, month: v.month - 1 },
                        )
                    }
                    data-ds-focusable=""
                    style={navButtonStyle}
                >
                    <IconChevronLeft size={14} />
                </button>
                <div
                    style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'var(--ds-color-foreground-primary)',
                    }}
                >
                    {monthLabel}
                </div>
                <button
                    type="button"
                    aria-label="Next month"
                    onClick={() =>
                        setView((v) =>
                            v.month === 11
                                ? { year: v.year + 1, month: 0 }
                                : { year: v.year, month: v.month + 1 },
                        )
                    }
                    data-ds-focusable=""
                    style={navButtonStyle}
                >
                    <IconChevronRight size={14} />
                </button>
            </header>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px',
                    marginBottom: '6px',
                }}
            >
                {weekdays.map((w) => (
                    <div
                        key={w}
                        style={{
                            textAlign: 'center',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '4px 0',
                            color: 'var(--ds-color-foreground-tertiary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
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
                    gap: '4px',
                }}
            >
                {days.map((d) => {
                    const iso = formatISO(d)
                    const inMonth = d.getMonth() === view.month
                    const isSelected = iso === current
                    const isToday = iso === today
                    const isMarked = markedSet.has(iso)
                    const isDisabled =
                        (minDate && iso < minDate) ||
                        (maxDate && iso > maxDate)
                    return (
                        <button
                            key={iso}
                            type="button"
                            disabled={!!isDisabled}
                            onClick={() => select(d)}
                            data-ds-focusable=""
                            style={{
                                position: 'relative',
                                aspectRatio: '1',
                                background: isSelected
                                    ? 'var(--ds-color-accent-background)'
                                    : 'transparent',
                                color: isSelected
                                    ? 'var(--ds-color-accent-color)'
                                    : inMonth
                                      ? 'var(--ds-color-foreground-primary)'
                                      : 'var(--ds-color-foreground-muted)',
                                border:
                                    isToday && !isSelected
                                        ? '1px solid var(--ds-color-accent-background)'
                                        : 'none',
                                borderRadius: 'var(--ds-radius-sm)',
                                fontSize: '13px',
                                fontWeight: isSelected ? 700 : 500,
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit',
                                opacity: isDisabled ? 0.4 : 1,
                                transition: 'all 80ms ease',
                            }}
                        >
                            {d.getDate()}
                            {isMarked && !isSelected && (
                                <span
                                    aria-hidden
                                    style={{
                                        position: 'absolute',
                                        bottom: '4px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        background:
                                            'var(--ds-color-accent-background)',
                                    }}
                                />
                            )}
                        </button>
                    )
                })}
            </div>
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
