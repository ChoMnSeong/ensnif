import {
    useEffect,
    useLayoutEffect,
    useState,
    type CSSProperties,
    type ReactNode,
    type RefObject,
} from 'react'
import { createPortal } from 'react-dom'

export type PopoverProps = {
    open: boolean
    triggerRef: RefObject<HTMLElement | null>
    children: ReactNode
    offset?: number
    align?: 'start' | 'center' | 'end'
    placement?: 'auto' | 'bottom' | 'top'
    matchTriggerWidth?: boolean
    minWidth?: number
    style?: CSSProperties
    zIndex?: number
}

type Pos = {
    top: number
    left: number
    width: number
    placement: 'bottom' | 'top'
}

export const Popover = ({
    open,
    triggerRef,
    children,
    offset = 6,
    align = 'start',
    placement = 'auto',
    matchTriggerWidth,
    minWidth,
    style,
    zIndex = 1000,
}: PopoverProps) => {
    const [pos, setPos] = useState<Pos | null>(null)

    useLayoutEffect(() => {
        if (!open) {
            setPos(null)
            return
        }
        const update = () => {
            const el = triggerRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const viewportHeight = window.innerHeight
            const spaceBelow = viewportHeight - rect.bottom
            const resolvedPlacement: Pos['placement'] =
                placement === 'auto'
                    ? spaceBelow < 280 && rect.top > 280
                        ? 'top'
                        : 'bottom'
                    : placement

            const top =
                resolvedPlacement === 'bottom'
                    ? rect.bottom + offset + window.scrollY
                    : rect.top - offset + window.scrollY
            const triggerWidth = rect.width

            let left = rect.left + window.scrollX
            if (align === 'center')
                left = rect.left + rect.width / 2 + window.scrollX
            if (align === 'end')
                left = rect.right + window.scrollX

            setPos({ top, left, width: triggerWidth, placement: resolvedPlacement })
        }
        update()
        window.addEventListener('scroll', update, true)
        window.addEventListener('resize', update)
        return () => {
            window.removeEventListener('scroll', update, true)
            window.removeEventListener('resize', update)
        }
    }, [open, triggerRef, offset, align, placement])

    useEffect(() => {
        if (!open || !pos) return
    }, [open, pos])

    if (!open || !pos || typeof document === 'undefined') return null

    const transformY = pos.placement === 'top' ? 'translateY(-100%)' : 'none'
    const transformX =
        align === 'center'
            ? 'translateX(-50%)'
            : align === 'end'
              ? 'translateX(-100%)'
              : 'none'
    const transform = [transformX, transformY]
        .filter((s) => s !== 'none')
        .join(' ')

    const portalNode = (
        <div
            data-ds-popover
            style={{
                position: 'absolute',
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                ...(matchTriggerWidth ? { width: `${pos.width}px` } : null),
                ...(minWidth ? { minWidth: `${minWidth}px` } : null),
                transform: transform || undefined,
                zIndex,
                ...style,
            }}
        >
            {children}
        </div>
    )

    return createPortal(portalNode, document.body)
}
