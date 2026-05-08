import { useState, type CSSProperties, type HTMLAttributes, type Ref } from 'react'
import { mergeStyles } from './types.js'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type AvatarProps = {
    src?: string
    alt?: string
    name?: string
    size?: AvatarSize
    shape?: 'circle' | 'rounded'
    fallback?: React.ReactNode
    ref?: Ref<HTMLSpanElement>
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>

const sizes: Record<AvatarSize, { box: number; font: number }> = {
    xs: { box: 20, font: 10 },
    sm: { box: 28, font: 11 },
    md: { box: 36, font: 13 },
    lg: { box: 48, font: 16 },
    xl: { box: 64, font: 22 },
}

const initialsOf = (name?: string): string => {
    if (!name) return ''
    const trimmed = name.trim()
    if (!trimmed) return ''
    const parts = trimmed.split(/\s+/)
    if (parts.length === 1) return trimmed.slice(0, 2).toUpperCase()
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}

export const Avatar = ({
    src,
    alt,
    name,
    size = 'md',
    shape = 'circle',
    fallback,
    style,
    ref,
    ...rest
}: AvatarProps) => {
    const [errored, setErrored] = useState(false)
    const showImage = src && !errored
    const { box, font } = sizes[size]
    return (
        <span
            ref={ref}
            style={mergeStyles(
                {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: `${box}px`,
                    height: `${box}px`,
                    borderRadius:
                        shape === 'circle' ? '50%' : 'var(--ds-radius-md)',
                    background: 'var(--ds-color-accent-background)',
                    color: 'var(--ds-color-accent-color)',
                    fontSize: `${font}px`,
                    fontWeight: 700,
                    overflow: 'hidden',
                    flexShrink: 0,
                    fontFamily: 'inherit',
                    userSelect: 'none',
                },
                style,
            )}
            {...rest}
        >
            {showImage ? (
                <img
                    src={src}
                    alt={alt ?? name ?? ''}
                    onError={() => setErrored(true)}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            ) : (
                fallback ?? initialsOf(name)
            )}
        </span>
    )
}

export type AvatarGroupProps = {
    max?: number
    spacing?: number
} & HTMLAttributes<HTMLDivElement>

export const AvatarGroup = ({
    max,
    spacing = -8,
    children,
    style,
    ...rest
}: AvatarGroupProps) => {
    const childArray = Array.isArray(children)
        ? children
        : children
          ? [children]
          : []
    const visible = max ? childArray.slice(0, max) : childArray
    const overflow = max ? childArray.length - max : 0

    return (
        <div
            style={mergeStyles(
                { display: 'inline-flex', alignItems: 'center' },
                style,
            )}
            {...rest}
        >
            {visible.map((child, idx) => (
                <span
                    key={idx}
                    style={{
                        marginLeft: idx === 0 ? 0 : `${spacing}px`,
                        boxShadow: '0 0 0 2px var(--ds-color-background-card)',
                        borderRadius: '50%',
                        display: 'inline-flex',
                    }}
                >
                    {child}
                </span>
            ))}
            {overflow > 0 && (
                <Avatar
                    name={`+${overflow}`}
                    fallback={`+${overflow}`}
                    style={{
                        marginLeft: `${spacing}px`,
                        background: 'var(--ds-color-background-inset)',
                        color: 'var(--ds-color-foreground-secondary)',
                        boxShadow: '0 0 0 2px var(--ds-color-background-card)',
                    }}
                />
            )}
        </div>
    )
}
