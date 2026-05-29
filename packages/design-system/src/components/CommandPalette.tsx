import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
    type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { IconSearch } from './icons.js'

export type CommandItem = {
    id: string
    label: string
    description?: string
    icon?: ReactNode
    group?: string
    keywords?: string[]
    shortcut?: string
    onSelect: () => void
}

export type CommandPaletteProps = {
    open: boolean
    onClose: () => void
    items: CommandItem[]
    placeholder?: string
    emptyMessage?: ReactNode
}

export const CommandPalette = ({
    open,
    onClose,
    items,
    placeholder = '명령어 또는 검색어 입력...',
    emptyMessage = '결과 없음',
}: CommandPaletteProps) => {
    const [query, setQuery] = useState('')
    const [highlight, setHighlight] = useState(0)
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (!open) {
            setQuery('')
            setHighlight(0)
            return
        }
        const t = setTimeout(() => inputRef.current?.focus(), 30)
        return () => clearTimeout(t)
    }, [open])

    useEffect(() => {
        if (!open) return
        const onKey = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        const overflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', onKey)
            document.body.style.overflow = overflow
        }
    }, [open, onClose])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return items
        return items.filter((it) => {
            const hay = [
                it.label,
                it.description ?? '',
                it.group ?? '',
                ...(it.keywords ?? []),
            ]
                .join(' ')
                .toLowerCase()
            return hay.includes(q)
        })
    }, [items, query])

    useEffect(() => {
        setHighlight(0)
    }, [query])

    const grouped = useMemo(() => {
        const map = new Map<string, CommandItem[]>()
        for (const it of filtered) {
            const g = it.group ?? ''
            if (!map.has(g)) map.set(g, [])
            map.get(g)!.push(it)
        }
        return Array.from(map.entries())
    }, [filtered])

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
            const it = filtered[highlight]
            if (it) {
                it.onSelect()
                onClose()
            }
        }
    }

    if (!open || typeof document === 'undefined') return null

    let runningIndex = 0
    const node = (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 2000,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: '80px 16px 16px',
            }}
        >
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(15, 18, 24, 0.6)',
                    backdropFilter: 'blur(2px)',
                    animation: 'ds-fade-in 160ms ease',
                }}
            />
            <div
                role="dialog"
                aria-modal="true"
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '560px',
                    background: 'var(--ds-surface-overlay-background)',
                    backdropFilter: 'var(--ds-surface-overlay-backdrop-filter)',
                    border: 'var(--ds-surface-overlay-border)',
                    borderRadius: 'var(--ds-surface-overlay-radius)',
                    boxShadow: 'var(--ds-surface-overlay-shadow)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '70vh',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        borderBottom: '1px solid var(--ds-color-border-subtle)',
                    }}
                >
                    <IconSearch
                        size={16}
                        style={{
                            color: 'var(--ds-color-foreground-tertiary)',
                            flexShrink: 0,
                        }}
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={onKey}
                        placeholder={placeholder}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: 'var(--ds-color-foreground-primary)',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            padding: 0,
                        }}
                    />
                </div>
                <div
                    data-ds-scrollbar=""
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '6px',
                    }}
                >
                    {filtered.length === 0 ? (
                        <div
                            style={{
                                padding: '32px 16px',
                                textAlign: 'center',
                                color: 'var(--ds-color-foreground-tertiary)',
                                fontSize: '13px',
                            }}
                        >
                            {emptyMessage}
                        </div>
                    ) : (
                        grouped.map(([group, list]) => (
                            <div key={group}>
                                {group && (
                                    <div
                                        style={{
                                            padding: '8px 10px 4px',
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                            color: 'var(--ds-color-foreground-tertiary)',
                                        }}
                                    >
                                        {group}
                                    </div>
                                )}
                                {list.map((it) => {
                                    const idx = runningIndex++
                                    const isActive = idx === highlight
                                    return (
                                        <button
                                            key={it.id}
                                            type="button"
                                            onClick={() => {
                                                it.onSelect()
                                                onClose()
                                            }}
                                            onMouseEnter={() => setHighlight(idx)}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '8px 10px',
                                                background: isActive
                                                    ? 'var(--ds-color-background-inset)'
                                                    : 'transparent',
                                                color: 'var(--ds-color-foreground-primary)',
                                                border: 'none',
                                                borderRadius: 'var(--ds-radius-sm)',
                                                cursor: 'pointer',
                                                fontFamily: 'inherit',
                                                textAlign: 'left',
                                                fontSize: '13px',
                                            }}
                                        >
                                            {it.icon && (
                                                <span
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        color: 'var(--ds-color-foreground-tertiary)',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {it.icon}
                                                </span>
                                            )}
                                            <div
                                                style={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '2px',
                                                }}
                                            >
                                                <span style={{ fontWeight: 600 }}>
                                                    {it.label}
                                                </span>
                                                {it.description && (
                                                    <span
                                                        style={{
                                                            fontSize: '11px',
                                                            color: 'var(--ds-color-foreground-tertiary)',
                                                        }}
                                                    >
                                                        {it.description}
                                                    </span>
                                                )}
                                            </div>
                                            {it.shortcut && (
                                                <span
                                                    style={{
                                                        fontSize: '11px',
                                                        color: 'var(--ds-color-foreground-tertiary)',
                                                        fontFamily:
                                                            'var(--ds-typography-fontFamily-mono)',
                                                    }}
                                                >
                                                    {it.shortcut}
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        ))
                    )}
                </div>
                <div
                    style={{
                        padding: '8px 14px',
                        borderTop: '1px solid var(--ds-color-border-subtle)',
                        display: 'flex',
                        gap: '14px',
                        fontSize: '11px',
                        color: 'var(--ds-color-foreground-tertiary)',
                        fontFamily: 'var(--ds-typography-fontFamily-mono)',
                    }}
                >
                    <span>↑↓ 이동</span>
                    <span>↵ 선택</span>
                    <span>esc 닫기</span>
                </div>
            </div>
        </div>
    )

    return createPortal(node, document.body)
}
