import { useCallback, useState, type CSSProperties } from 'react'
import { mergeStyles, sizeHeight, sizeText, type Size } from './types.js'
import { IconMinus, IconPlus } from './icons.js'

const HIDE_SPINNERS = `
[data-ds-numberinput] input[type=number]::-webkit-outer-spin-button,
[data-ds-numberinput] input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
[data-ds-numberinput] input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
}
`.trim()
import {
    borderVariantContainerStyle,
    type BorderVariant,
} from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

export type NumberInputProps = {
    value?: number
    defaultValue?: number
    onChange?: (value: number) => void
    min?: number
    max?: number
    step?: number
    size?: Size
    variant?: BorderVariant
    disabled?: boolean
    placeholder?: string
    fullWidth?: boolean
    formatValue?: (n: number) => string
    style?: CSSProperties
}

export const NumberInput = ({
    value: controlled,
    defaultValue = 0,
    onChange,
    min,
    max,
    step = 1,
    size = 'md',
    variant: variantProp,
    disabled,
    placeholder,
    fullWidth,
    style,
}: NumberInputProps) => {
    const variant = useBorderVariant(variantProp)
    const [internal, setInternal] = useState<number>(defaultValue)
    const value = controlled ?? internal

    const setValue = useCallback(
        (n: number) => {
            const clamped =
                min !== undefined && n < min
                    ? min
                    : max !== undefined && n > max
                      ? max
                      : n
            if (controlled === undefined) setInternal(clamped)
            onChange?.(clamped)
        },
        [controlled, onChange, min, max],
    )

    const wrapperStyle: CSSProperties = {
        display: 'inline-flex',
        alignItems: 'stretch',
        height: sizeHeight[size],
        overflow: 'hidden',
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.5 : 1,
        transition: 'border-color 120ms ease, box-shadow 120ms ease',
        ...borderVariantContainerStyle(variant, { surfaceToken: 'inset' }),
    }

    const buttonStyle: CSSProperties = {
        width: '32px',
        background: 'transparent',
        border: 'none',
        color: 'var(--ds-color-foreground-secondary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'inherit',
    }

    const dividerColor =
        variant === 'underline'
            ? 'transparent'
            : 'var(--ds-color-border-subtle)'

    return (
        <div
            data-ds-numberinput=""
            data-ds-focus-within=""
            data-ds-input-variant={variant}
            style={mergeStyles(wrapperStyle, style)}
        >
            <style>{HIDE_SPINNERS}</style>
            <button
                type="button"
                onClick={() => setValue(value - step)}
                disabled={disabled}
                aria-label="Decrease"
                style={{
                    ...buttonStyle,
                    borderRight: `1px solid ${dividerColor}`,
                }}
            >
                <IconMinus size={14} />
            </button>
            <input
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                step={step}
                value={value}
                disabled={disabled}
                placeholder={placeholder}
                onChange={(e) => {
                    const n = Number(e.target.value)
                    if (!Number.isNaN(n)) setValue(n)
                }}
                style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    textAlign: 'center',
                    fontSize: sizeText[size],
                    fontFamily: 'var(--ds-typography-fontFamily-mono)',
                    color: 'var(--ds-color-foreground-primary)',
                    minWidth: '60px',
                    padding: 0,
                }}
            />
            <button
                type="button"
                onClick={() => setValue(value + step)}
                disabled={disabled}
                aria-label="Increase"
                style={{
                    ...buttonStyle,
                    borderLeft: `1px solid ${dividerColor}`,
                }}
            >
                <IconPlus size={14} />
            </button>
        </div>
    )
}
