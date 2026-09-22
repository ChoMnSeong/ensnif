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
    transition:
        'background var(--ds-motion-duration-fast) var(--ds-motion-easing-ease-out), border-color var(--ds-motion-duration-fast) var(--ds-motion-easing-ease-out), color var(--ds-motion-duration-fast) var(--ds-motion-easing-ease-out)',
    lineHeight: 1,
    whiteSpace: 'nowrap',
}

const variantStyle = (v: ButtonVariant, disabled: boolean): CSSProperties => {
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
                color: 'var(--ds-color-foreground-on-success)',
                border: 'none',
            }
        case 'warning':
            return {
                background: 'var(--ds-color-state-warning)',
                color: 'var(--ds-color-foreground-on-warning)',
                border: 'none',
            }
        case 'danger':
            return {
                background: 'var(--ds-color-state-danger)',
                color: 'var(--ds-color-foreground-on-danger)',
                border: 'none',
            }
    }
}

/** variant 별로 인터랙션 레이어가 쓸 tone. InteractionStyles 의 선택자와 짝이다. */
const interactiveTone: Record<ButtonVariant, string> = {
    primary: 'accent',
    secondary: 'outline',
    ghost: 'subtle',
    success: 'success',
    warning: 'warning',
    danger: 'danger',
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
        data-ds-spinner=""
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
        <button
            ref={ref}
            disabled={isDisabled}
            data-ds-focusable=""
            data-ds-interactive={interactiveTone[variant]}
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
            {!loading && iconRight && <span style={iconWrap}>{iconRight}</span>}
        </button>
    )
}
