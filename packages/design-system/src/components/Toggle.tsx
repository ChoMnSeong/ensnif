import { useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode, type Ref } from 'react'
import {
    mergeStyles,
    sizeText,
    sizeHeight,
    sizePadX,
    type Size,
} from './types.js'

export type ToggleProps = {
    pressed?: boolean
    defaultPressed?: boolean
    onPressedChange?: (pressed: boolean) => void
    size?: Size
    iconLeft?: ReactNode
    iconRight?: ReactNode
    ref?: Ref<HTMLButtonElement>
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>

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
    border: '1px solid transparent',
}

export const Toggle = ({
    pressed: controlledPressed,
    defaultPressed = false,
    onPressedChange,
    size = 'md',
    iconLeft,
    iconRight,
    children,
    disabled,
    style,
    ref,
    onClick,
    ...rest
}: ToggleProps) => {
    const [internal, setInternal] = useState(defaultPressed)
    const pressed = controlledPressed ?? internal
    const visual: CSSProperties = pressed
        ? {
              background: 'var(--ds-color-accent-background)',
              color: 'var(--ds-color-accent-color)',
              border: 'var(--ds-color-accent-border)',
          }
        : {
              background: 'transparent',
              color: 'var(--ds-color-foreground-secondary)',
              border: '1px solid var(--ds-color-border-default)',
          }

    return (
        <button
            ref={ref}
            type="button"
            aria-pressed={pressed}
            disabled={disabled}
            data-ds-focusable=""
            style={mergeStyles(
                baseStyle,
                {
                    height: sizeHeight[size],
                    padding: `0 ${sizePadX[size]}`,
                    fontSize: sizeText[size],
                },
                visual,
                disabled ? { opacity: 0.5, cursor: 'not-allowed' } : null,
                style,
            )}
            onClick={(e) => {
                onClick?.(e)
                if (e.defaultPrevented) return
                const next = !pressed
                if (controlledPressed === undefined) setInternal(next)
                onPressedChange?.(next)
            }}
            {...rest}
        >
            {iconLeft}
            {children}
            {iconRight}
        </button>
    )
}
