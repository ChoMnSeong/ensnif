import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { themedPalette } from '@libs/style/theme'
import React from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'text'
export type ButtonSize = 'sm' | 'md'

export interface ButtonProps {
    className?: string
    children: React.ReactNode
    variant?: ButtonVariant
    size?: ButtonSize
    fullWidth?: boolean
    disabled?: boolean
    type?: 'submit' | 'button'
    onClick?: () => void
    style?: React.CSSProperties
}

export type ButtonPropsProps = ButtonProps

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    function Button(props, ref) {
        const {
            className,
            children,
            type = 'button',
            onClick,
            disabled = false,
            variant = 'secondary',
            size = 'md',
            fullWidth = false,
            style,
        } = props

        return (
            <ButtonBlock
                className={className}
                type={type}
                ref={ref}
                onClick={onClick}
                disabled={disabled}
                variant={variant}
                size={size}
                fullWidth={fullWidth}
                style={style}
            >
                {children}
            </ButtonBlock>
        )
    },
)

export default Button

interface StyledButtonProps {
    variant: ButtonVariant
    size: ButtonSize
    fullWidth: boolean
    disabled: boolean
}

const sizeStyles = {
    sm: css`
        padding: 8px 20px;
        font-size: 0.875rem;
        font-weight: 400;
        border-radius: 4px;
    `,
    md: css`
        padding: 11px 32px;
        font-weight: 600;
        font-size: 1rem;
        border-radius: 6px;
    `,
}

const variantStyles = (disabled: boolean) => ({
    primary: css`
        background-color: ${disabled
            ? themedPalette.disabled
            : themedPalette.primary1};
        border-color: ${disabled
            ? themedPalette.disabled
            : themedPalette.primary1};
        color: ${disabled ? themedPalette.text4 : themedPalette.white};
        &:hover {
            background-color: ${themedPalette.primary2};
            border-color: ${themedPalette.primary2};
        }
    `,
    secondary: css`
        background-color: transparent;
        border-color: ${themedPalette.border2};
        color: ${themedPalette.text2};
        &:hover {
            background-color: ${themedPalette.bg_element3};
        }
    `,
    destructive: css`
        background-color: ${disabled
            ? themedPalette.disabled
            : themedPalette.destructive1};
        border-color: ${disabled
            ? themedPalette.disabled
            : themedPalette.destructive1};
        color: ${disabled ? themedPalette.text4 : themedPalette.white};
        &:hover {
            background-color: ${themedPalette.destructive_hover};
            border-color: ${themedPalette.destructive_hover};
        }
    `,
    text: css`
        background-color: transparent;
        border-color: transparent;
        color: ${themedPalette.button_text};
        justify-content: flex-start;
        &:hover {
            color: ${themedPalette.primary1};
        }
    `,
})

const ButtonBlock = styled.button<StyledButtonProps>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    box-sizing: border-box;
    outline: 0;
    border: 1px solid transparent;
    margin: 0;
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
    user-select: none;
    vertical-align: middle;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    ${({ fullWidth }) =>
        fullWidth &&
        css`
            width: 100%;
            padding-inline: 0;
        `}

    ${({ size }) => sizeStyles[size]}
    ${({ variant, disabled }) => variantStyles(disabled)[variant]}
`
