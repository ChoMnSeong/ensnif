import type {
    CSSProperties,
    InputHTMLAttributes,
    ReactNode,
    Ref,
} from 'react'
import {
    mergeStyles,
    sizeText,
    sizeHeight,
    sizePadX,
    type Size,
} from './types.js'
import {
    borderVariantContainerStyle,
    type BorderVariant,
} from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

export type InputProps = {
    size?: Size
    variant?: BorderVariant
    invalid?: boolean
    prefix?: ReactNode
    suffix?: ReactNode
    fullWidth?: boolean
    ref?: Ref<HTMLInputElement>
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>

const wrapperStyle = (
    size: Size,
    variant: BorderVariant,
    invalid: boolean,
    fullWidth: boolean,
): CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    height: sizeHeight[size],
    padding:
        variant === 'underline' ? `0 0` : `0 ${sizePadX[size]}`,
    color: 'var(--ds-color-foreground-primary)',
    fontSize: sizeText[size],
    fontFamily: 'inherit',
    transition: 'border-color 120ms ease, box-shadow 120ms ease',
    width: fullWidth ? '100%' : 'auto',
    gap: '8px',
    ...borderVariantContainerStyle(variant, { invalid, surfaceToken: 'inset' }),
})

const inputStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'inherit',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    padding: 0,
    height: '100%',
}

export const Input = ({
    size = 'md',
    variant: variantProp,
    invalid = false,
    prefix,
    suffix,
    fullWidth,
    style,
    ref,
    ...rest
}: InputProps) => {
    const variant = useBorderVariant(variantProp)
    return (
        <span
            data-ds-focus-within=""
            data-ds-input-variant={variant}
            style={mergeStyles(
                wrapperStyle(size, variant, invalid, !!fullWidth),
                style,
            )}
        >
            {prefix && (
                <span
                    style={{
                        color: 'var(--ds-color-foreground-tertiary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                >
                    {prefix}
                </span>
            )}
            <input ref={ref} style={inputStyle} {...rest} />
            {suffix && (
                <span
                    style={{
                        color: 'var(--ds-color-foreground-tertiary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                >
                    {suffix}
                </span>
            )}
        </span>
    )
}
