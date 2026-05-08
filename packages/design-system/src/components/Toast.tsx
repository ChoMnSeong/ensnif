import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
    type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import {
    IconClose,
    IconError,
    IconInfo,
    IconSuccess,
    IconWarning,
    type IconType,
} from './icons.js'
import { toneColor, type Tone } from './types.js'

export type ToastTone = Exclude<Tone, 'accent' | 'neutral'> | 'info'

export type ToastOptions = {
    title?: ReactNode
    description?: ReactNode
    tone?: ToastTone
    duration?: number
    action?: { label: string; onClick: () => void }
}

export type ToastItem = ToastOptions & { id: string }

type ToastContextValue = {
    toast: (opts: ToastOptions) => string
    success: (opts: Omit<ToastOptions, 'tone'>) => string
    error: (opts: Omit<ToastOptions, 'tone'>) => string
    warning: (opts: Omit<ToastOptions, 'tone'>) => string
    info: (opts: Omit<ToastOptions, 'tone'>) => string
    dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const iconByTone: Record<ToastTone, IconType> = {
    info: IconInfo,
    success: IconSuccess,
    warning: IconWarning,
    danger: IconError,
}

export type ToastProviderProps = {
    children: ReactNode
    placement?: 'top-right' | 'bottom-right' | 'top-center' | 'bottom-center'
}

export const ToastProvider = ({
    children,
    placement = 'bottom-right',
}: ToastProviderProps) => {
    const [items, setItems] = useState<ToastItem[]>([])
    const idRef = useRef(0)

    const dismiss = useCallback((id: string) => {
        setItems((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const toast = useCallback(
        (opts: ToastOptions): string => {
            const id = `t-${++idRef.current}`
            const item: ToastItem = { ...opts, id }
            setItems((prev) => [...prev, item])
            const duration = opts.duration ?? 4000
            if (duration > 0) {
                setTimeout(() => dismiss(id), duration)
            }
            return id
        },
        [dismiss],
    )

    const success = useCallback(
        (opts: Omit<ToastOptions, 'tone'>) => toast({ ...opts, tone: 'success' }),
        [toast],
    )
    const error = useCallback(
        (opts: Omit<ToastOptions, 'tone'>) => toast({ ...opts, tone: 'danger' }),
        [toast],
    )
    const warning = useCallback(
        (opts: Omit<ToastOptions, 'tone'>) => toast({ ...opts, tone: 'warning' }),
        [toast],
    )
    const info = useCallback(
        (opts: Omit<ToastOptions, 'tone'>) => toast({ ...opts, tone: 'info' }),
        [toast],
    )

    return (
        <ToastContext.Provider
            value={{ toast, success, error, warning, info, dismiss }}
        >
            {children}
            {typeof document !== 'undefined' &&
                createPortal(
                    <ToastViewport
                        items={items}
                        placement={placement}
                        onDismiss={dismiss}
                    />,
                    document.body,
                )}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
    return ctx
}

const placementStyles: Record<
    NonNullable<ToastProviderProps['placement']>,
    React.CSSProperties
> = {
    'top-right': { top: '16px', right: '16px', alignItems: 'flex-end' },
    'bottom-right': { bottom: '16px', right: '16px', alignItems: 'flex-end' },
    'top-center': {
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        alignItems: 'center',
    },
    'bottom-center': {
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        alignItems: 'center',
    },
}

const MAX_VISIBLE_TOASTS = 4
const STACK_OFFSET = 12
const STACK_SCALE_STEP = 0.04

const ToastViewport = ({
    items,
    placement,
    onDismiss,
}: {
    items: ToastItem[]
    placement: NonNullable<ToastProviderProps['placement']>
    onDismiss: (id: string) => void
}) => {
    const isBottom = placement.startsWith('bottom')
    const isCenter = placement.endsWith('center')
    const [expanded, setExpanded] = useState(false)
    const visible = items.slice(-MAX_VISIBLE_TOASTS)

    const transformOrigin = `${isBottom ? 'bottom' : 'top'} ${
        isCenter ? 'center' : 'right'
    }`

    return (
        <div
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            style={{
                position: 'fixed',
                zIndex: 9999,
                width: '380px',
                maxWidth: 'calc(100vw - 32px)',
                pointerEvents: 'none',
                ...placementStyles[placement],
            }}
        >
            <style>{KEYFRAMES}</style>
            <div
                style={{
                    position: 'relative',
                    height:
                        expanded
                            ? `${visible.length * 72}px`
                            : '92px',
                    transition: 'height 240ms ease',
                }}
            >
                {visible.map((t, idx) => {
                    const fromNewest = visible.length - 1 - idx
                    const yShift = fromNewest * STACK_OFFSET
                    const scale = 1 - fromNewest * STACK_SCALE_STEP
                    const expandedShift = isBottom
                        ? -(visible.length - 1 - idx) * 72
                        : idx * 72

                    const transform = expanded
                        ? `translateY(${expandedShift}px)`
                        : `translateY(${isBottom ? -yShift : yShift}px) scale(${scale})`

                    return (
                        <div
                            key={t.id}
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                ...(isBottom ? { bottom: 0 } : { top: 0 }),
                                transform,
                                transformOrigin,
                                opacity: expanded
                                    ? 1
                                    : 1 - fromNewest * 0.15,
                                zIndex: visible.length - fromNewest,
                                transition:
                                    'transform 280ms cubic-bezier(0.32, 0.72, 0, 1), opacity 220ms ease',
                                pointerEvents:
                                    expanded || fromNewest === 0
                                        ? 'auto'
                                        : 'none',
                            }}
                        >
                            <ToastItemView item={t} onDismiss={onDismiss} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const KEYFRAMES = `@keyframes ds-toast-in {
    from { opacity: 0; transform: translateY(8px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}`

const ToastItemView = ({
    item,
    onDismiss,
}: {
    item: ToastItem
    onDismiss: (id: string) => void
}) => {
    const tone = item.tone ?? 'info'
    const color = toneColor(tone as Tone)
    const Icon = iconByTone[tone]

    return (
        <div
            role="status"
            style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                minWidth: '280px',
                maxWidth: '420px',
                padding: '12px 14px',
                background: 'var(--ds-surface-overlay-background)',
                backdropFilter: 'var(--ds-surface-overlay-backdrop-filter)',
                border: 'var(--ds-surface-overlay-border)',
                borderLeft: `3px solid ${color}`,
                borderRadius: 'var(--ds-radius-md)',
                boxShadow: 'var(--ds-shadow-xl)',
                color: 'var(--ds-color-foreground-primary)',
                animation: 'ds-toast-in 200ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            <span
                style={{
                    color,
                    display: 'inline-flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    marginTop: '1px',
                }}
            >
                <Icon size={18} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
                {item.title && (
                    <div
                        style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            marginBottom: item.description ? '2px' : 0,
                        }}
                    >
                        {item.title}
                    </div>
                )}
                {item.description && (
                    <div
                        style={{
                            fontSize: '12px',
                            color: 'var(--ds-color-foreground-secondary)',
                            lineHeight: 1.5,
                        }}
                    >
                        {item.description}
                    </div>
                )}
                {item.action && (
                    <button
                        type="button"
                        onClick={() => {
                            item.action?.onClick()
                            onDismiss(item.id)
                        }}
                        style={{
                            marginTop: '6px',
                            padding: '4px 10px',
                            background: 'transparent',
                            color,
                            border: `1px solid ${color}`,
                            borderRadius: 'var(--ds-radius-sm)',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                        }}
                    >
                        {item.action.label}
                    </button>
                )}
            </div>
            <button
                type="button"
                aria-label="Close"
                onClick={() => onDismiss(item.id)}
                style={{
                    flexShrink: 0,
                    width: '20px',
                    height: '20px',
                    background: 'transparent',
                    color: 'var(--ds-color-foreground-tertiary)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--ds-radius-sm)',
                }}
            >
                <IconClose size={14} />
            </button>
        </div>
    )
}
