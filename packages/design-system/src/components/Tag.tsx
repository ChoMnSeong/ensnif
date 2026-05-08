import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'
import { IconClose } from './icons.js'
import { mergeStyles, toneColor, type Tone } from './types.js'
import type { BorderVariant } from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

export type TagProps = {
    tone?: Tone | 'default'
    size?: 'sm' | 'md'
    solid?: boolean
    variant?: BorderVariant
    onClose?: () => void
    iconLeft?: ReactNode
    ref?: Ref<HTMLSpanElement>
} & HTMLAttributes<HTMLSpanElement>

const sizeStyles = {
    sm: { padding: '3px 8px', fontSize: '11px', closeSize: 11 },
    md: { padding: '4px 10px', fontSize: '12px', closeSize: 13 },
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
            borderRadius: 'var(--ds-radius-md)',
        }
    }

    const fg = isDefault
        ? 'var(--ds-color-foreground-primary)'
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
                borderRadius: 'var(--ds-radius-md)',
            }
        case 'ghost':
            return {
                background: 'transparent',
                color: fg,
                border: 'none',
                borderRadius: 'var(--ds-radius-md)',
            }
        case 'outlined':
        default:
            return {
                background: isDefault
                    ? 'var(--ds-color-background-inset)'
                    : 'transparent',
                color: fg,
                border: `1px solid ${accentColor}`,
                borderRadius: 'var(--ds-radius-md)',
            }
    }
}

export const Tag = ({
    tone = 'default',
    size = 'md',
    solid = false,
    variant: variantProp,
    onClose,
    iconLeft,
    children,
    style,
    ref,
    ...rest
}: TagProps) => {
    const variant = useBorderVariant(variantProp)
    const s = sizeStyles[size]
    const appearance = computeAppearance(tone, solid, variant)

    return (
        <span
            ref={ref}
            style={mergeStyles(
                {
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 500,
                    fontFamily: 'inherit',
                    padding: s.padding,
                    fontSize: s.fontSize,
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                },
                appearance,
                style,
            )}
            {...rest}
        >
            {iconLeft && (
                <span style={{ display: 'inline-flex' }}>{iconLeft}</span>
            )}
            <span>{children}</span>
            {onClose && (
                <button
                    type="button"
                    aria-label="Remove"
                    onClick={(e) => {
                        e.stopPropagation()
                        onClose()
                    }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '14px',
                        height: '14px',
                        background: 'transparent',
                        color: 'currentColor',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        padding: 0,
                        opacity: 0.6,
                        flexShrink: 0,
                    }}
                >
                    <IconClose size={s.closeSize} />
                </button>
            )}
        </span>
    )
}
