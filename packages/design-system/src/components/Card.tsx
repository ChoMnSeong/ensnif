import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'
import { mergeStyles } from './types.js'
import {
    borderVariantContainerStyle,
    type BorderVariant,
} from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

export type CardProps = {
    surface?: 'card' | 'panel' | 'overlay'
    variant?: BorderVariant
    padded?: boolean
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

const outlinedSurfaceStyle = (
    s: 'card' | 'panel' | 'overlay',
): CSSProperties => ({
    background: `var(--ds-surface-${s}-background)`,
    backdropFilter: `var(--ds-surface-${s}-backdrop-filter)`,
    border: `var(--ds-surface-${s}-border)`,
    borderRadius: `var(--ds-surface-${s}-radius)`,
    boxShadow: `var(--ds-surface-${s}-shadow)`,
    color: `var(--ds-surface-${s}-color)`,
})

export const Card = ({
    surface = 'card',
    variant: variantProp,
    padded = true,
    style,
    ref,
    ...rest
}: CardProps) => {
    const variant = useBorderVariant(variantProp)
    const containerStyle: CSSProperties =
        variant === 'outlined'
            ? outlinedSurfaceStyle(surface)
            : borderVariantContainerStyle(variant, { surfaceToken: surface })
    return (
        <div
            ref={ref}
            style={mergeStyles(
                containerStyle,
                padded ? { padding: '20px' } : null,
                style,
            )}
            {...rest}
        />
    )
}

export type CardSlotProps = HTMLAttributes<HTMLDivElement>

export const CardHeader = ({ style, ...rest }: CardSlotProps) => (
    <div
        style={mergeStyles(
            {
                marginBottom: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
            },
            style,
        )}
        {...rest}
    />
)

export const CardTitle = ({
    style,
    ...rest
}: HTMLAttributes<HTMLHeadingElement>) => (
    <h3
        style={mergeStyles(
            {
                fontSize: '15px',
                fontWeight: 600,
                margin: 0,
                color: 'var(--ds-color-foreground-primary)',
            },
            style,
        )}
        {...rest}
    />
)

export const CardDescription = ({
    style,
    ...rest
}: HTMLAttributes<HTMLParagraphElement>) => (
    <p
        style={mergeStyles(
            {
                fontSize: '12px',
                margin: 0,
                color: 'var(--ds-color-foreground-tertiary)',
                lineHeight: 1.5,
            },
            style,
        )}
        {...rest}
    />
)

export const CardBody = ({ style, ...rest }: CardSlotProps) => (
    <div
        style={mergeStyles(
            {
                fontSize: '13px',
                color: 'var(--ds-color-foreground-secondary)',
                lineHeight: 1.6,
            },
            style,
        )}
        {...rest}
    />
)

export const CardFooter = ({ style, ...rest }: CardSlotProps) => (
    <div
        style={mergeStyles(
            {
                marginTop: '14px',
                paddingTop: '12px',
                borderTop: '1px solid var(--ds-color-border-subtle)',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
            },
            style,
        )}
        {...rest}
    />
)

interface CardCompound extends React.FC<CardProps> {
    Header: typeof CardHeader
    Title: typeof CardTitle
    Description: typeof CardDescription
    Body: typeof CardBody
    Footer: typeof CardFooter
}

const CardWithSlots = Card as unknown as CardCompound
CardWithSlots.Header = CardHeader
CardWithSlots.Title = CardTitle
CardWithSlots.Description = CardDescription
CardWithSlots.Body = CardBody
CardWithSlots.Footer = CardFooter
