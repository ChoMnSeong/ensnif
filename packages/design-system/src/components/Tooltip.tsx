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

export type TooltipProps = {
    content: ReactNode
    children: ReactElement<any>
    delay?: number
    side?: 'top' | 'bottom'
    align?: 'start' | 'center' | 'end'
}

export const Tooltip = ({
    content,
    children,
    delay = 200,
    side = 'top',
    align = 'center',
}: TooltipProps) => {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLElement | null>(null)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const show = useCallback(() => {
        timer.current && clearTimeout(timer.current)
        timer.current = setTimeout(() => setOpen(true), delay)
    }, [delay])

    const hide = useCallback(() => {
        timer.current && clearTimeout(timer.current)
        setOpen(false)
    }, [])

    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current)
    }, [])

    if (!isValidElement(children)) return <>{children}</>

    const childProps = (children.props ?? {}) as Record<string, unknown>
    const enhanced = cloneElement(children, {
        ref: (node: HTMLElement | null) => {
            triggerRef.current = node
            const original = (children as { ref?: unknown }).ref
            if (typeof original === 'function') original(node)
            else if (
                original &&
                typeof original === 'object' &&
                'current' in original
            ) {
                ;(original as { current: HTMLElement | null }).current = node
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

    return (
        <>
            {enhanced}
            <Popover
                open={open}
                triggerRef={triggerRef}
                offset={6}
                align={align}
                placement={side}
                zIndex={2000}
            >
                <div
                    role="tooltip"
                    style={{
                        background: 'var(--ds-color-foreground-primary)',
                        color: 'var(--ds-color-background-page)',
                        fontSize: '11px',
                        fontWeight: 500,
                        padding: '5px 9px',
                        borderRadius: 'var(--ds-radius-sm)',
                        boxShadow: 'var(--ds-shadow-lg)',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                    }}
                >
                    {content}
                </div>
            </Popover>
        </>
    )
}
