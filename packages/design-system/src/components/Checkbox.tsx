import {
    useCallback,
    useEffect,
    useRef,
    type CSSProperties,
    type InputHTMLAttributes,
    type ReactNode,
    type Ref,
} from 'react'
import { mergeStyles } from './types.js'

export type CheckboxProps = {
    label?: ReactNode
    indeterminate?: boolean
    size?: 'sm' | 'md'
    ref?: Ref<HTMLInputElement>
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>

const sizes = {
    sm: { box: 14, font: 13 },
    md: { box: 16, font: 14 },
}

export const Checkbox = ({
    label,
    indeterminate,
    size = 'md',
    checked,
    disabled,
    style,
    ref,
    ...rest
}: CheckboxProps) => {
    const innerRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (innerRef.current) {
            innerRef.current.indeterminate = !!indeterminate
        }
    }, [indeterminate])

    const setRef = useCallback(
        (node: HTMLInputElement | null) => {
            innerRef.current = node
            if (typeof ref === 'function') ref(node)
            else if (ref && 'current' in ref) {
                ;(ref as { current: HTMLInputElement | null }).current = node
            }
        },
        [ref],
    )

    const dim = sizes[size].box
    const wrapperStyle: CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: `${sizes[size].font}px`,
        lineHeight: `${dim}px`,
        color: disabled
            ? 'var(--ds-color-foreground-muted)'
            : 'var(--ds-color-foreground-primary)',
        userSelect: 'none',
    }

    const visualStyle: CSSProperties = {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${dim}px`,
        height: `${dim}px`,
        flexShrink: 0,
        background:
            checked || indeterminate
                ? 'var(--ds-color-accent-background)'
                : 'var(--ds-surface-inset-background)',
        border:
            checked || indeterminate
                ? 'var(--ds-color-accent-border)'
                : '1px solid var(--ds-color-border-default)',
        borderRadius: 'var(--ds-radius-xs)',
        transition: 'all 120ms ease',
        boxShadow: checked ? 'var(--ds-color-accent-shadow)' : 'none',
        opacity: disabled ? 0.5 : 1,
    }

    return (
        <label style={mergeStyles(wrapperStyle, style)}>
            <input
                {...rest}
                ref={setRef}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                data-ds-focus-input=""
                style={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    padding: 0,
                    margin: -1,
                    overflow: 'hidden',
                    clip: 'rect(0,0,0,0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                }}
            />
            <span aria-hidden data-ds-focus-visual="" style={visualStyle}>
                {indeterminate ? (
                    <svg
                        viewBox="0 0 16 16"
                        width={dim}
                        height={dim}
                        fill="none"
                        style={{ display: 'block' }}
                    >
                        <line
                            x1="4"
                            y1="8"
                            x2="12"
                            y2="8"
                            stroke="var(--ds-color-accent-color)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    </svg>
                ) : checked ? (
                    <svg
                        viewBox="0 0 16 16"
                        width={dim}
                        height={dim}
                        fill="none"
                        style={{ display: 'block' }}
                    >
                        <path
                            d="M3.5 8.2 L6.5 11 L12.5 5"
                            stroke="var(--ds-color-accent-color)"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ) : null}
            </span>
            {label && (
                <span style={{ lineHeight: 1.4 }}>{label}</span>
            )}
        </label>
    )
}
