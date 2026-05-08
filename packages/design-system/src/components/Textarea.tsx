import type {
    CSSProperties,
    Ref,
    TextareaHTMLAttributes,
} from 'react'
import { mergeStyles, type Size } from './types.js'
import {
    borderVariantContainerStyle,
    type BorderVariant,
} from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

export type TextareaProps = {
    size?: Size
    variant?: BorderVariant
    invalid?: boolean
    fullWidth?: boolean
    autoResize?: boolean
    ref?: Ref<HTMLTextAreaElement>
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>

const sizePadding: Record<Size, string> = {
    sm: '8px 10px',
    md: '10px 12px',
    lg: '12px 14px',
}

const sizeFont: Record<Size, string> = {
    sm: '12px',
    md: '13px',
    lg: '14px',
}

export const Textarea = ({
    size = 'md',
    variant: variantProp,
    invalid = false,
    fullWidth,
    rows = 4,
    style,
    ref,
    onInput,
    autoResize,
    ...rest
}: TextareaProps) => {
    const variant = useBorderVariant(variantProp)
    const baseContainer = borderVariantContainerStyle(variant, {
        invalid,
        surfaceToken: 'inset',
    })
    const containerStyle: CSSProperties =
        variant === 'underline'
            ? { ...baseContainer, padding: 0, borderRadius: 0 }
            : baseContainer
    return (
        <textarea
            ref={ref}
            rows={rows}
            data-ds-focus-within=""
            data-ds-input-variant={variant}
            onInput={(e) => {
                onInput?.(e)
                if (autoResize) {
                    const el = e.currentTarget
                    el.style.height = 'auto'
                    el.style.height = `${el.scrollHeight}px`
                }
            }}
            style={mergeStyles(
                {
                    padding: sizePadding[size],
                    fontSize: sizeFont[size],
                    fontFamily: 'inherit',
                    color: 'var(--ds-color-foreground-primary)',
                    width: fullWidth ? '100%' : 'auto',
                    resize: autoResize ? 'none' : 'vertical',
                    outline: 'none',
                    lineHeight: 1.5,
                    transition:
                        'border-color 120ms ease, box-shadow 120ms ease',
                },
                containerStyle,
                style,
            )}
            {...rest}
        />
    )
}
