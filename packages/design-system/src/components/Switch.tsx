import type { CSSProperties, InputHTMLAttributes, Ref } from 'react'
import { mergeStyles } from './types.js'

export type SwitchProps = {
    size?: 'sm' | 'md'
    label?: string
    ref?: Ref<HTMLInputElement>
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>

const sizes = {
    sm: { width: 32, height: 18, knob: 12 },
    md: { width: 42, height: 24, knob: 18 },
}

export const Switch = ({
    size = 'md',
    label,
    checked,
    disabled,
    style,
    ref,
    ...rest
}: SwitchProps) => {
    const s = sizes[size]
    const trackStyle: CSSProperties = {
        position: 'relative',
        display: 'inline-block',
        width: `${s.width}px`,
        height: `${s.height}px`,
        background: checked
            ? 'var(--ds-color-accent-background)'
            : 'var(--ds-color-background-inset)',
        border: checked
            ? 'var(--ds-color-accent-border)'
            : '1px solid var(--ds-color-border-default)',
        borderRadius: '9999px',
        transition: 'background 160ms ease',
        opacity: disabled ? 0.5 : 1,
        flexShrink: 0,
    }
    const knobStyle: CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: checked
            ? `calc(100% - ${s.knob}px - 2px)`
            : '2px',
        width: `${s.knob}px`,
        height: `${s.knob}px`,
        transform: 'translateY(-50%)',
        borderRadius: '50%',
        background: checked
            ? 'var(--ds-color-accent-color)'
            : 'var(--ds-color-foreground-tertiary)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        transition: 'left 160ms ease, background 160ms ease',
    }
    return (
        <label
            style={mergeStyles(
                {
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    color: 'var(--ds-color-foreground-primary)',
                    fontSize: '14px',
                    lineHeight: `${s.height}px`,
                    userSelect: 'none',
                },
                style,
            )}
        >
            <input
                {...rest}
                ref={ref}
                type="checkbox"
                role="switch"
                checked={checked}
                disabled={disabled}
                data-ds-focus-input=""
                style={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    overflow: 'hidden',
                    clip: 'rect(0,0,0,0)',
                    border: 0,
                    margin: -1,
                    padding: 0,
                }}
            />
            <span aria-hidden data-ds-focus-visual="" style={trackStyle}>
                <span style={knobStyle} />
            </span>
            {label && <span style={{ lineHeight: 1.4 }}>{label}</span>}
        </label>
    )
}
