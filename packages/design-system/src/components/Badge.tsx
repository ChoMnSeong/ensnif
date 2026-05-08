import type { CSSProperties, HTMLAttributes, Ref } from 'react'
import { mergeStyles, toneColor, type Tone } from './types.js'
import type { BorderVariant } from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

export type BadgeProps = {
    tone?: Tone | 'default'
    size?: 'sm' | 'md'
    dot?: boolean
    solid?: boolean
    variant?: BorderVariant
    ref?: Ref<HTMLSpanElement>
} & HTMLAttributes<HTMLSpanElement>

const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: 600,
    fontFamily: 'inherit',
    letterSpacing: '0.01em',
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
}

const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '10px' },
    md: { padding: '3px 10px', fontSize: '11px' },
}

const computeAppearance = (
    tone: Tone | 'default',
    solid: boolean,
    variant: BorderVariant,
): CSSProperties => {
    const isDefault = tone === 'default'
    const accentColor = isDefault
        ? 'var(--ds-color-foreground-tertiary)'
        : toneColor(tone as Tone)

    if (solid) {
        return {
            background: isDefault
                ? 'var(--ds-color-background-inset)'
                : toneColor(tone as Tone),
            color: isDefault
                ? 'var(--ds-color-foreground-primary)'
                : '#ffffff',
            border: 'none',
            borderRadius: 'var(--ds-radius-full)',
        }
    }

    const fg = isDefault
        ? 'var(--ds-color-foreground-secondary)'
        : toneColor(tone as Tone)

    switch (variant) {
        case 'underline':
            return {
                background: 'transparent',
                color: fg,
                border: 'none',
                borderBottom: `1.5px solid ${accentColor}`,
                borderRadius: 0,
            }
        case 'filled':
            return {
                background: isDefault
                    ? 'var(--ds-color-background-inset)'
                    : `color-mix(in srgb, ${accentColor} 18%, transparent)`,
                color: fg,
                border: 'none',
                borderRadius: 'var(--ds-radius-full)',
            }
        case 'ghost':
            return {
                background: 'transparent',
                color: fg,
                border: 'none',
                borderRadius: 'var(--ds-radius-full)',
            }
        case 'outlined':
        default:
            return {
                background: isDefault
                    ? 'var(--ds-color-background-inset)'
                    : 'transparent',
                color: fg,
                border: `1px solid ${
                    isDefault
                        ? 'var(--ds-color-border-subtle)'
                        : accentColor
                }`,
                borderRadius: 'var(--ds-radius-full)',
            }
    }
}

export const Badge = ({
    tone = 'default',
    size = 'md',
    dot,
    solid = false,
    variant: variantProp,
    children,
    style,
    ref,
    ...rest
}: BadgeProps) => {
    const variant = useBorderVariant(variantProp)
    const appearance = computeAppearance(tone, solid, variant)
    const isDefault = tone === 'default'

    return (
        <span
            ref={ref}
            style={mergeStyles(
                baseStyle,
                sizeStyles[size],
                appearance,
                style,
            )}
            {...rest}
        >
            {dot && (
                <span
                    aria-hidden
                    style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: solid
                            ? '#ffffff'
                            : isDefault
                              ? 'var(--ds-color-foreground-tertiary)'
                              : toneColor(tone as Tone),
                        marginRight: '6px',
                        flexShrink: 0,
                    }}
                />
            )}
            {children}
        </span>
    )
}
