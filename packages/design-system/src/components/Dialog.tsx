import {
    useEffect,
    useRef,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { mergeStyles } from './types.js'
import { IconClose } from './icons.js'

export type DialogProps = {
    open: boolean
    onClose: () => void
    title?: ReactNode
    description?: ReactNode
    children?: ReactNode
    footer?: ReactNode
    size?: 'sm' | 'md' | 'lg'
    closeOnBackdrop?: boolean
    closeOnEsc?: boolean
}

const sizeWidth = {
    sm: '380px',
    md: '480px',
    lg: '640px',
}

export const Dialog = ({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    closeOnBackdrop = true,
    closeOnEsc = true,
}: DialogProps) => {
    const panelRef = useRef<HTMLDivElement | null>(null)
    const previouslyFocused = useRef<Element | null>(null)

    useEffect(() => {
        if (!open) return
        previouslyFocused.current = document.activeElement
        const overflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const t = setTimeout(() => panelRef.current?.focus(), 0)
        return () => {
            clearTimeout(t)
            document.body.style.overflow = overflow
            if (
                previouslyFocused.current &&
                'focus' in previouslyFocused.current
            ) {
                ;(previouslyFocused.current as HTMLElement).focus?.()
            }
        }
    }, [open])

    useEffect(() => {
        if (!open || !closeOnEsc) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, closeOnEsc, onClose])

    if (!open) return null
    if (typeof document === 'undefined') return null

    const node = (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}
        >
            <div
                onClick={() => closeOnBackdrop && onClose()}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(15, 18, 24, 0.6)',
                    backdropFilter: 'blur(2px)',
                    animation: 'ds-fade-in 160ms ease',
                }}
            />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: sizeWidth[size],
                    background: 'var(--ds-surface-overlay-background)',
                    backdropFilter:
                        'var(--ds-surface-overlay-backdrop-filter)',
                    border: 'var(--ds-surface-overlay-border)',
                    borderRadius: 'var(--ds-surface-overlay-radius)',
                    boxShadow: 'var(--ds-surface-overlay-shadow)',
                    color: 'var(--ds-surface-overlay-color)',
                    outline: 'none',
                    animation:
                        'ds-dialog-in 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                    overflow: 'hidden',
                }}
            >
                <style>
                    {`@keyframes ds-fade-in { from { opacity: 0 } to { opacity: 1 } }
@keyframes ds-dialog-in { from { opacity: 0; transform: translateY(8px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }`}
                </style>
                {(title || description) && (
                    <header
                        style={{
                            padding: '20px 24px 14px',
                        }}
                    >
                        {title && (
                            <h2
                                style={{
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    margin: 0,
                                    marginBottom: description ? '4px' : 0,
                                    color: 'var(--ds-color-foreground-primary)',
                                }}
                            >
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p
                                style={{
                                    fontSize: '13px',
                                    margin: 0,
                                    color: 'var(--ds-color-foreground-tertiary)',
                                    lineHeight: 1.5,
                                }}
                            >
                                {description}
                            </p>
                        )}
                    </header>
                )}
                {children && (
                    <div
                        style={{
                            padding: '0 24px 20px',
                            fontSize: '13px',
                            color: 'var(--ds-color-foreground-secondary)',
                            lineHeight: 1.6,
                        }}
                    >
                        {children}
                    </div>
                )}
                {footer && (
                    <footer
                        style={{
                            padding: '14px 24px',
                            borderTop:
                                '1px solid var(--ds-color-border-subtle)',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '8px',
                            background:
                                'var(--ds-color-background-inset)',
                        }}
                    >
                        {footer}
                    </footer>
                )}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '28px',
                        height: '28px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--ds-color-foreground-tertiary)',
                        cursor: 'pointer',
                        borderRadius: 'var(--ds-radius-sm)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <IconClose size={18} />
                </button>
            </div>
        </div>
    )

    return createPortal(node, document.body)
}

export type DialogActionsProps = HTMLAttributes<HTMLDivElement>

export const DialogActions = ({ style, ...rest }: DialogActionsProps) => (
    <div
        style={mergeStyles(
            { display: 'flex', justifyContent: 'flex-end', gap: '8px' },
            style,
        )}
        {...rest}
    />
)
