import type { CSSProperties, HTMLAttributes, Ref } from 'react'
import { mergeStyles } from './types.js'

export type SpinnerProps = {
    size?: number | string
    thickness?: number
    color?: string
    label?: string
    ref?: Ref<HTMLSpanElement>
} & HTMLAttributes<HTMLSpanElement>

const KEYFRAME = `@keyframes ds-spin { to { transform: rotate(360deg); } }`

export const Spinner = ({
    size = 16,
    thickness = 2,
    color,
    label,
    style,
    ref,
    ...rest
}: SpinnerProps) => {
    const dim = typeof size === 'number' ? `${size}px` : size
    const spinnerStyle: CSSProperties = {
        display: 'inline-block',
        width: dim,
        height: dim,
        border: `${thickness}px solid currentColor`,
        borderRightColor: 'transparent',
        borderRadius: '50%',
        animation: 'ds-spin 700ms linear infinite',
        color: color ?? 'var(--ds-color-accent-background)',
    }
    return (
        <>
            <style>{KEYFRAME}</style>
            <span
                ref={ref}
                role="status"
                aria-label={label ?? 'Loading'}
                style={mergeStyles(
                    {
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: color ?? 'var(--ds-color-accent-background)',
                    },
                    style,
                )}
                {...rest}
            >
                <span style={spinnerStyle} />
                {label && (
                    <span
                        style={{
                            fontSize: '13px',
                            color: 'var(--ds-color-foreground-secondary)',
                        }}
                    >
                        {label}
                    </span>
                )}
            </span>
        </>
    )
}
