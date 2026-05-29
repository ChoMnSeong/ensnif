import {
    useCallback,
    useRef,
    useState,
    type ChangeEvent,
    type CSSProperties,
    type InputHTMLAttributes,
    type ReactNode,
    type Ref,
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
import { IconClose, IconEye, IconEyeOff } from './icons.js'

export type InputProps = {
    size?: Size
    variant?: BorderVariant
    invalid?: boolean
    prefix?: ReactNode
    suffix?: ReactNode
    fullWidth?: boolean
    /** password 타입일 때 내용 보이기/숨기기 토글 버튼을 노출한다. 기본값은 password 타입이면 true */
    revealable?: boolean
    /** 입력값이 있을 때 전체 지우기 버튼을 노출한다. */
    clearable?: boolean
    /** clear 버튼을 눌러 입력값이 비워진 뒤 호출된다. */
    onClear?: () => void
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

const actionButtonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    border: 'none',
    background: 'transparent',
    color: 'var(--ds-color-foreground-tertiary)',
    cursor: 'pointer',
    lineHeight: 0,
}

const adornmentStyle: CSSProperties = {
    color: 'var(--ds-color-foreground-tertiary)',
    display: 'inline-flex',
    alignItems: 'center',
}

/**
 * controlled input의 값을 React가 인지하는 방식으로 비운다. native value setter로
 * 값을 바꾼 뒤 input 이벤트를 dispatch 하면 부모의 onChange 가 정상적으로 호출된다.
 */
const clearNativeValue = (node: HTMLInputElement) => {
    const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
    )?.set
    setter?.call(node, '')
    node.dispatchEvent(new Event('input', { bubbles: true }))
}

export const Input = ({
    size = 'md',
    variant: variantProp,
    invalid = false,
    prefix,
    suffix,
    fullWidth,
    revealable,
    clearable = false,
    onClear,
    type = 'text',
    style,
    ref,
    onChange,
    ...rest
}: InputProps) => {
    const variant = useBorderVariant(variantProp)
    const innerRef = useRef<HTMLInputElement | null>(null)

    const setRefs = useCallback(
        (node: HTMLInputElement | null) => {
            innerRef.current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
        },
        [ref],
    )

    const isControlled = rest.value !== undefined
    const [internalHasValue, setInternalHasValue] = useState(
        () =>
            String(rest.defaultValue ?? '').length > 0 ||
            String(rest.value ?? '').length > 0,
    )
    const hasValue = isControlled
        ? String(rest.value ?? '').length > 0
        : internalHasValue

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (!isControlled) setInternalHasValue(e.target.value.length > 0)
            onChange?.(e)
        },
        [isControlled, onChange],
    )

    const handleClear = useCallback(() => {
        const node = innerRef.current
        if (node) {
            clearNativeValue(node)
            node.focus()
        }
        if (!isControlled) setInternalHasValue(false)
        onClear?.()
    }, [isControlled, onClear])

    const isPassword = type === 'password'
    const showReveal = revealable ?? isPassword
    const [revealed, setRevealed] = useState(false)
    const effectiveType = isPassword && revealed ? 'text' : type

    const showClear = clearable && hasValue && !rest.disabled && !rest.readOnly
    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16

    return (
        <span
            data-ds-focus-within=""
            data-ds-input-variant={variant}
            style={mergeStyles(
                wrapperStyle(size, variant, invalid, !!fullWidth),
                style,
            )}
        >
            {prefix && <span style={adornmentStyle}>{prefix}</span>}
            <input
                ref={setRefs}
                type={effectiveType}
                style={inputStyle}
                onChange={handleChange}
                {...rest}
            />
            {showClear && (
                <button
                    type="button"
                    aria-label="Clear"
                    onClick={handleClear}
                    tabIndex={-1}
                    style={actionButtonStyle}
                >
                    <IconClose size={iconSize} />
                </button>
            )}
            {showReveal && (
                <button
                    type="button"
                    aria-label={revealed ? 'Hide password' : 'Show password'}
                    aria-pressed={revealed}
                    onClick={() => setRevealed((v) => !v)}
                    disabled={rest.disabled}
                    style={actionButtonStyle}
                >
                    {revealed ? (
                        <IconEyeOff size={iconSize} />
                    ) : (
                        <IconEye size={iconSize} />
                    )}
                </button>
            )}
            {suffix && <span style={adornmentStyle}>{suffix}</span>}
        </span>
    )
}
