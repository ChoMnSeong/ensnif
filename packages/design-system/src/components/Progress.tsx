import type { CSSProperties, HTMLAttributes, Ref } from 'react'
import { mergeStyles, toneColor, type Tone } from './types.js'

export type ProgressProps = {
    value: number
    max?: number
    size?: 'sm' | 'md' | 'lg'
    tone?: Tone
    showLabel?: boolean
    indeterminate?: boolean
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

const sizes = {
    sm: 4,
    md: 8,
    lg: 12,
}

const KEYFRAME = `@keyframes ds-progress-indet {
    0% { left: -40%; width: 40%; }
    50% { left: 30%; width: 60%; }
    100% { left: 100%; width: 40%; }
}`

export const Progress = ({
    value,
    max = 100,
    size = 'md',
    tone = 'accent',
    showLabel,
    indeterminate,
    style,
    ref,
    ...rest
}: ProgressProps) => {
    const pct = Math.max(0, Math.min(100, (value / max) * 100))
    const trackHeight = sizes[size]
    const fill = tone === 'accent' ? 'var(--ds-color-accent-background)' : toneColor(tone)
    return (
        <>
            <style>{KEYFRAME}</style>
            <div
                ref={ref}
                role="progressbar"
                aria-valuenow={indeterminate ? undefined : Math.round(pct)}
                aria-valuemin={0}
                aria-valuemax={100}
                style={mergeStyles(
                    {
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                    },
                    style,
                )}
                {...rest}
            >
                {showLabel && !indeterminate && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '11px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            fontFamily: 'var(--ds-typography-fontFamily-mono)',
                        }}
                    >
                        <span>{Math.round(pct)}%</span>
                        <span>{`${value} / ${max}`}</span>
                    </div>
                )}
                <div
                    style={{
                        position: 'relative',
                        height: `${trackHeight}px`,
                        background: 'var(--ds-color-background-inset)',
                        borderRadius: 'var(--ds-radius-full)',
                        overflow: 'hidden',
                    }}
                >
                    {indeterminate ? (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                background: fill,
                                borderRadius: 'var(--ds-radius-full)',
                                animation:
                                    'ds-progress-indet 1.4s ease-in-out infinite',
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: `${pct}%`,
                                height: '100%',
                                background: fill,
                                borderRadius: 'var(--ds-radius-full)',
                                transition: 'width 240ms ease',
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    )
}
