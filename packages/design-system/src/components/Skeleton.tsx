import type { CSSProperties, HTMLAttributes, Ref } from 'react'
import { mergeStyles } from './types.js'

export type SkeletonProps = {
    width?: string | number
    height?: string | number
    radius?: string
    circle?: boolean
    lines?: number
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

const KEYFRAME = `@keyframes ds-skeleton-shimmer {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
}`

const baseStyle: CSSProperties = {
    display: 'block',
    background:
        'linear-gradient(90deg, var(--ds-color-background-inset) 0%, var(--ds-color-background-muted) 50%, var(--ds-color-background-inset) 100%)',
    backgroundSize: '200% 100%',
    animation: 'ds-skeleton-shimmer 1.4s ease-in-out infinite',
    borderRadius: 'var(--ds-radius-sm)',
}

const px = (v: string | number) => (typeof v === 'number' ? `${v}px` : v)

export const Skeleton = ({
    width = '100%',
    height = 14,
    radius,
    circle,
    lines,
    style,
    ref,
    ...rest
}: SkeletonProps) => {
    if (lines && lines > 1) {
        return (
            <>
                <style>{KEYFRAME}</style>
                <div
                    ref={ref}
                    style={mergeStyles(
                        {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                        },
                        style,
                    )}
                    {...rest}
                >
                    {Array.from({ length: lines }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                ...baseStyle,
                                width:
                                    i === lines - 1
                                        ? '60%'
                                        : px(width),
                                height: px(height),
                                borderRadius: radius ?? 'var(--ds-radius-sm)',
                            }}
                        />
                    ))}
                </div>
            </>
        )
    }
    return (
        <>
            <style>{KEYFRAME}</style>
            <div
                ref={ref}
                style={mergeStyles(
                    baseStyle,
                    {
                        width: px(width),
                        height: px(height),
                        borderRadius: circle
                            ? '50%'
                            : (radius ?? 'var(--ds-radius-sm)'),
                    },
                    style,
                )}
                {...rest}
            />
        </>
    )
}
