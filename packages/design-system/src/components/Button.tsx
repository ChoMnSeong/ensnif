import type { ButtonHTMLAttributes, CSSProperties, ReactNode, Ref } from 'react'
import {
    mergeStyles,
    sizeText,
    sizeHeight,
    sizePadX,
    type Size,
} from './types.js'

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'success'
    | 'warning'
    | 'danger'

export type ButtonProps = {
    variant?: ButtonVariant
    size?: Size
    loading?: boolean
    iconLeft?: ReactNode
    iconRight?: ReactNode
    fullWidth?: boolean
    ref?: Ref<HTMLButtonElement>
} & ButtonHTMLAttributes<HTMLButtonElement>

const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontFamily: 'inherit',
    fontWeight: 600,
    cursor: 'pointer',
    borderRadius: 'var(--ds-radius-md)',
    transition: 'all 120ms ease',
    lineHeight: 1,
    whiteSpace: 'nowrap',
}

const variantStyle = (
    v: ButtonVariant,
    disabled: boolean,
): CSSProperties => {
    if (disabled) {
        return {
            background: 'var(--ds-color-state-disabled)',
            color: 'var(--ds-color-foreground-muted)',
            border: 'none',
            boxShadow: 'none',
            cursor: 'not-allowed',
        }
    }
    switch (v) {
        case 'primary':
            return {
                background: 'var(--ds-color-accent-background)',
                color: 'var(--ds-color-accent-color)',
                border: 'var(--ds-color-accent-border)',
                boxShadow: 'var(--ds-color-accent-shadow)',
            }
        case 'secondary':
            return {
                background: 'transparent',
                color: 'var(--ds-color-foreground-primary)',
                border: '1px solid var(--ds-color-border-default)',
            }
        case 'ghost':
            return {
                background: 'transparent',
                color: 'var(--ds-color-foreground-secondary)',
                border: 'none',
            }
        case 'success':
            return {
                background: 'var(--ds-color-state-success)',
                color: '#ffffff',
                border: 'none',
            }
        case 'warning':
            return {
                background: 'var(--ds-color-state-warning)',
                color: '#ffffff',
                border: 'none',
            }
        case 'danger':
            return {
                background: 'var(--ds-color-state-danger)',
                color: '#ffffff',
                border: 'none',
            }
    }
}

const iconWrap: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
}

const Spinner = () => (
    <span
        aria-hidden
        style={{
            width: '12px',
            height: '12px',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'ds-spin 700ms linear infinite',
        }}
    />
)

export const Button = ({
    variant = 'primary',
    size = 'md',
    loading,
    iconLeft,
    iconRight,
    fullWidth,
    disabled,
    children,
    style,
    ref,
    ...rest
}: ButtonProps) => {
    const isDisabled = disabled || loading
    return (
        <>
            <style>
                {`@keyframes ds-spin { to { transform: rotate(360deg); } }`}
            </style>
            <button
                ref={ref}
                disabled={isDisabled}
                data-ds-focusable=""
                style={mergeStyles(
                    baseStyle,
                    {
                        height: sizeHeight[size],
                        padding: `0 ${sizePadX[size]}`,
                        fontSize: sizeText[size],
                    },
                    variantStyle(variant, !!isDisabled),
                    fullWidth ? { width: '100%' } : null,
                    style,
                )}
                {...rest}
            >
                {loading ? (
                    <span style={iconWrap}>
                        <Spinner />
                    </span>
                ) : iconLeft ? (
                    <span style={iconWrap}>{iconLeft}</span>
                ) : null}
                {children}
                {!loading && iconRight && (
                    <span style={iconWrap}>{iconRight}</span>
                )}
            </button>
        </>
    )
}
