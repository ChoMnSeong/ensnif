import {
    cloneElement,
    isValidElement,
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactElement,
    type ReactNode,
} from 'react'
import { Popover } from './Popover.js'

export type HoverCardProps = {
    content: ReactNode
    children: ReactElement<any>
    openDelay?: number
    closeDelay?: number
    side?: 'top' | 'bottom'
    align?: 'start' | 'center' | 'end'
    width?: number | string
}

export const HoverCard = ({
    content,
    children,
    openDelay = 300,
    closeDelay = 150,
    side = 'bottom',
    align = 'center',
    width = 280,
}: HoverCardProps) => {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLElement | null>(null)
    const cardRef = useRef<HTMLDivElement | null>(null)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const cancel = () => {
        if (timer.current) {
            clearTimeout(timer.current)
            timer.current = null
        }
    }

    const show = useCallback(() => {
        cancel()
        timer.current = setTimeout(() => setOpen(true), openDelay)
    }, [openDelay])

    const hide = useCallback(() => {
        cancel()
        timer.current = setTimeout(() => setOpen(false), closeDelay)
    }, [closeDelay])

    useEffect(() => () => cancel(), [])

    if (!isValidElement(children)) return <>{children}</>

    const childProps = (children.props ?? {}) as Record<string, unknown>
    const enhanced = cloneElement(children, {
        ref: (node: HTMLElement | null) => {
            triggerRef.current = node
            const orig = (children as { ref?: unknown }).ref
            if (typeof orig === 'function') orig(node)
            else if (orig && typeof orig === 'object' && 'current' in orig) {
                ;(orig as { current: HTMLElement | null }).current = node
            }
        },
        onMouseEnter: (e: unknown) => {
            const fn = childProps.onMouseEnter as
                | ((e: unknown) => void)
                | undefined
            fn?.(e)
            show()
        },
        onMouseLeave: (e: unknown) => {
            const fn = childProps.onMouseLeave as
                | ((e: unknown) => void)
                | undefined
            fn?.(e)
            hide()
        },
        onFocus: (e: unknown) => {
            const fn = childProps.onFocus as ((e: unknown) => void) | undefined
            fn?.(e)
            show()
        },
        onBlur: (e: unknown) => {
            const fn = childProps.onBlur as ((e: unknown) => void) | undefined
            fn?.(e)
            hide()
        },
    } as never)

    const widthStyle = typeof width === 'number' ? `${width}px` : width

    return (
        <>
            {enhanced}
            <Popover
                open={open}
                triggerRef={triggerRef}
                offset={8}
                placement={side}
                align={align}
                zIndex={1500}
            >
                <div
                    ref={cardRef}
                    onMouseEnter={cancel}
                    onMouseLeave={hide}
                    style={{
                        width: widthStyle,
                        padding: '14px 16px',
                        background: 'var(--ds-surface-overlay-background)',
                        backdropFilter:
                            'var(--ds-surface-overlay-backdrop-filter)',
                        border: 'var(--ds-surface-overlay-border)',
                        borderRadius: 'var(--ds-surface-overlay-radius)',
                        boxShadow: 'var(--ds-surface-overlay-shadow)',
                        color: 'var(--ds-surface-overlay-color)',
                        fontSize: '13px',
                        lineHeight: 1.5,
                    }}
                >
                    {content}
                </div>
            </Popover>
        </>
    )
}
