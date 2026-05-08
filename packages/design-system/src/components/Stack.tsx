import type { CSSProperties, HTMLAttributes, Ref } from 'react'
import { mergeStyles } from './types.js'

export type StackProps = {
    direction?: 'row' | 'column'
    gap?: string | number
    align?: CSSProperties['alignItems']
    justify?: CSSProperties['justifyContent']
    wrap?: boolean
    inline?: boolean
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

export const Stack = ({
    direction = 'column',
    gap = 8,
    align,
    justify,
    wrap,
    inline,
    style,
    ref,
    ...rest
}: StackProps) => (
    <div
        ref={ref}
        style={mergeStyles(
            {
                display: inline ? 'inline-flex' : 'flex',
                flexDirection: direction,
                gap: typeof gap === 'number' ? `${gap}px` : gap,
                alignItems: align,
                justifyContent: justify,
                flexWrap: wrap ? 'wrap' : undefined,
            },
            style,
        )}
        {...rest}
    />
)

export const HStack = (props: Omit<StackProps, 'direction'>) => (
    <Stack {...props} direction="row" />
)

export const VStack = (props: Omit<StackProps, 'direction'>) => (
    <Stack {...props} direction="column" />
)

export type SpacerProps = {
    size?: string | number
    axis?: 'horizontal' | 'vertical' | 'both'
} & HTMLAttributes<HTMLSpanElement>

export const Spacer = ({
    size = 'auto',
    axis = 'both',
    style,
    ...rest
}: SpacerProps) => {
    const value = typeof size === 'number' ? `${size}px` : size
    return (
        <span
            aria-hidden
            style={mergeStyles(
                {
                    display: 'block',
                    flex: size === 'auto' ? 1 : undefined,
                    width: axis !== 'vertical' ? value : undefined,
                    height: axis !== 'horizontal' ? value : undefined,
                },
                style,
            )}
            {...rest}
        />
    )
}
