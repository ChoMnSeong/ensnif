import {
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
    type Ref,
} from 'react'
import { mergeStyles } from './types.js'

const KEYFRAMES = `
@keyframes ds-marquee-x { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@keyframes ds-marquee-y { from { transform: translateY(0) } to { transform: translateY(-50%) } }
`.trim()

export type MarqueeProps = {
    direction?: 'left' | 'right' | 'up' | 'down'
    /** Animation duration in seconds. Lower = faster. Default 12. */
    speed?: number
    pauseOnHover?: boolean
    /** Gap between items WITHIN children (not between repeats). */
    gap?: string | number
    children: ReactNode
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

export const Marquee = ({
    direction = 'left',
    speed = 12,
    pauseOnHover = true,
    gap = 24,
    children,
    style,
    ref,
    ...rest
}: MarqueeProps) => {
    const isHorizontal = direction === 'left' || direction === 'right'
    const reverse = direction === 'right' || direction === 'down'
    const animation = isHorizontal ? 'ds-marquee-x' : 'ds-marquee-y'
    const gapPx = typeof gap === 'number' ? `${gap}px` : gap

    const containerRef = useRef<HTMLDivElement | null>(null)
    const itemRef = useRef<HTMLDivElement | null>(null)
    const [copies, setCopies] = useState(2)

    useLayoutEffect(() => {
        const compute = () => {
            const c = containerRef.current
            const it = itemRef.current
            if (!c || !it) return
            const viewportSize = isHorizontal ? c.offsetWidth : c.offsetHeight
            const itemSize = isHorizontal ? it.offsetWidth : it.offsetHeight
            if (!viewportSize || !itemSize) return
            const perHalf = Math.max(1, Math.ceil(viewportSize / itemSize))
            const next = perHalf * 2
            setCopies((prev) => (prev !== next ? next : prev))
        }
        compute()
        const ro = new ResizeObserver(compute)
        if (containerRef.current) ro.observe(containerRef.current)
        if (itemRef.current) ro.observe(itemRef.current)
        return () => ro.disconnect()
    }, [isHorizontal, children, gap])

    const setBothRefs = (node: HTMLDivElement | null) => {
        containerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref && 'current' in ref) {
            ;(ref as { current: HTMLDivElement | null }).current = node
        }
    }

    const containerStyle: CSSProperties = {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
    }

    const trackStyle: CSSProperties = {
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        flexShrink: 0,
        animation: `${animation} ${speed}s linear infinite`,
        animationDirection: reverse ? 'reverse' : 'normal',
        animationPlayState: 'running',
    }

    const itemStyle: CSSProperties = {
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        gap: gapPx,
        flexShrink: 0,
        paddingRight: isHorizontal ? gapPx : undefined,
        paddingBottom: !isHorizontal ? gapPx : undefined,
    }

    return (
        <>
            <style>{KEYFRAMES}</style>
            <div
                ref={setBothRefs}
                style={mergeStyles(containerStyle, style)}
                {...rest}
            >
                <div
                    style={trackStyle}
                    onMouseEnter={(e) => {
                        if (pauseOnHover) {
                            ;(
                                e.currentTarget as HTMLElement
                            ).style.animationPlayState = 'paused'
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (pauseOnHover) {
                            ;(
                                e.currentTarget as HTMLElement
                            ).style.animationPlayState = 'running'
                        }
                    }}
                >
                    {Array.from({ length: copies }, (_, i) => (
                        <div
                            key={i}
                            aria-hidden={i > 0}
                            ref={i === 0 ? itemRef : undefined}
                            style={itemStyle}
                        >
                            {children}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
