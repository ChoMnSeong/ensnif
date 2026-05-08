import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconClose } from './icons.js'

export type DrawerSide = 'right' | 'left' | 'top' | 'bottom'

export type DrawerProps = {
    open: boolean
    onClose: () => void
    side?: DrawerSide
    size?: string | number
    title?: ReactNode
    description?: ReactNode
    footer?: ReactNode
    children?: ReactNode
    closeOnBackdrop?: boolean
    closeOnEsc?: boolean
}

const KEYFRAMES = `
@keyframes ds-drawer-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes ds-drawer-right { from { transform: translateX(100%) } to { transform: translateX(0) } }
@keyframes ds-drawer-left { from { transform: translateX(-100%) } to { transform: translateX(0) } }
@keyframes ds-drawer-top { from { transform: translateY(-100%) } to { transform: translateY(0) } }
@keyframes ds-drawer-bottom { from { transform: translateY(100%) } to { transform: translateY(0) } }
`

const sidePositions = (side: DrawerSide, sz: string) => {
    if (side === 'right')
        return {
            top: 0,
            right: 0,
            bottom: 0,
            width: sz,
            animation: 'ds-drawer-right 240ms cubic-bezier(0.4, 0, 0.2, 1)',
        }
    if (side === 'left')
        return {
            top: 0,
            left: 0,
            bottom: 0,
            width: sz,
            animation: 'ds-drawer-left 240ms cubic-bezier(0.4, 0, 0.2, 1)',
        }
    if (side === 'top')
        return {
            top: 0,
            left: 0,
            right: 0,
            height: sz,
            animation: 'ds-drawer-top 240ms cubic-bezier(0.4, 0, 0.2, 1)',
        }
    return {
        bottom: 0,
        left: 0,
        right: 0,
        height: sz,
        animation: 'ds-drawer-bottom 240ms cubic-bezier(0.4, 0, 0.2, 1)',
    }
}

export const Drawer = ({
    open,
    onClose,
    side = 'right',
    size = '380px',
    title,
    description,
    footer,
    children,
    closeOnBackdrop = true,
    closeOnEsc = true,
}: DrawerProps) => {
    useEffect(() => {
        if (!open) return
        const overflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = overflow
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

    if (!open || typeof document === 'undefined') return null

    const sz = typeof size === 'number' ? `${size}px` : size

    const node = (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
            <style>{KEYFRAMES}</style>
            <div
                onClick={() => closeOnBackdrop && onClose()}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(15, 18, 24, 0.6)',
                    backdropFilter: 'blur(2px)',
                    animation: 'ds-drawer-fade 200ms ease',
                }}
            />
            <aside
                role="dialog"
                aria-modal="true"
                style={{
                    position: 'absolute',
                    background: 'var(--ds-surface-overlay-background)',
                    backdropFilter: 'var(--ds-surface-overlay-backdrop-filter)',
                    color: 'var(--ds-surface-overlay-color)',
                    boxShadow: 'var(--ds-shadow-2xl)',
                    display: 'flex',
                    flexDirection: 'column',
                    ...sidePositions(side, sz),
                }}
            >
                {(title || description) && (
                    <header
                        style={{
                            padding: '20px 24px',
                            borderBottom:
                                '1px solid var(--ds-color-border-subtle)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: '12px',
                        }}
                    >
                        <div>
                            {title && (
                                <h2
                                    style={{
                                        fontSize: '15px',
                                        fontWeight: 700,
                                        margin: '0 0 2px',
                                        color: 'var(--ds-color-foreground-primary)',
                                    }}
                                >
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p
                                    style={{
                                        fontSize: '12px',
                                        margin: 0,
                                        color: 'var(--ds-color-foreground-tertiary)',
                                    }}
                                >
                                    {description}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            style={{
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
                                flexShrink: 0,
                            }}
                        >
                            <IconClose size={16} />
                        </button>
                    </header>
                )}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '20px 24px',
                    }}
                >
                    {children}
                </div>
                {footer && (
                    <footer
                        style={{
                            padding: '14px 24px',
                            borderTop:
                                '1px solid var(--ds-color-border-subtle)',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '8px',
                        }}
                    >
                        {footer}
                    </footer>
                )}
            </aside>
        </div>
    )

    return createPortal(node, document.body)
}
