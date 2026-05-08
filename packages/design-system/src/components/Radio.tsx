import {
    createContext,
    useContext,
    type CSSProperties,
    type InputHTMLAttributes,
    type ReactNode,
    type Ref,
} from 'react'
import { mergeStyles } from './types.js'

type RadioGroupContext = {
    name?: string
    value?: string
    onChange?: (value: string) => void
    disabled?: boolean
}

const RadioCtx = createContext<RadioGroupContext | null>(null)

export type RadioGroupProps = {
    name?: string
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    disabled?: boolean
    children: ReactNode
    direction?: 'row' | 'column'
    style?: CSSProperties
}

export const RadioGroup = ({
    name,
    value,
    onChange,
    disabled,
    children,
    direction = 'column',
    style,
}: RadioGroupProps) => {
    return (
        <RadioCtx.Provider value={{ name, value, onChange, disabled }}>
            <div
                role="radiogroup"
                style={mergeStyles(
                    {
                        display: 'flex',
                        flexDirection: direction,
                        gap: direction === 'row' ? '16px' : '8px',
                    },
                    style,
                )}
            >
                {children}
            </div>
        </RadioCtx.Provider>
    )
}

export type RadioProps = {
    label?: ReactNode
    value: string
    size?: 'sm' | 'md'
    ref?: Ref<HTMLInputElement>
} & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'size' | 'value' | 'onChange' | 'name'
>

const sizes = {
    sm: { box: 14, dot: 6, font: 13 },
    md: { box: 16, dot: 8, font: 14 },
}

export const Radio = ({
    label,
    value,
    size = 'md',
    disabled: ownDisabled,
    style,
    ref,
    ...rest
}: RadioProps) => {
    const ctx = useContext(RadioCtx)
    const disabled = ownDisabled ?? ctx?.disabled
    const checked = ctx ? ctx.value === value : (rest as { checked?: boolean }).checked
    const { box, dot, font } = sizes[size]

    return (
        <label
            style={mergeStyles(
                {
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    fontSize: `${font}px`,
                    lineHeight: `${box}px`,
                    color: disabled
                        ? 'var(--ds-color-foreground-muted)'
                        : 'var(--ds-color-foreground-primary)',
                    userSelect: 'none',
                },
                style,
            )}
        >
            <input
                {...rest}
                ref={ref}
                type="radio"
                name={ctx?.name}
                value={value}
                checked={checked}
                disabled={disabled}
                data-ds-focus-input=""
                onChange={() => {
                    if (ctx?.onChange) ctx.onChange(value)
                }}
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
            <span
                aria-hidden
                data-ds-focus-visual=""
                style={{
                    position: 'relative',
                    width: `${box}px`,
                    height: `${box}px`,
                    flexShrink: 0,
                    background: 'var(--ds-surface-inset-background)',
                    border: checked
                        ? `2px solid var(--ds-color-accent-background)`
                        : '1px solid var(--ds-color-border-default)',
                    borderRadius: '50%',
                    transition: 'all 120ms ease',
                    opacity: disabled ? 0.5 : 1,
                    display: 'inline-block',
                }}
            >
                {checked && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: `${dot}px`,
                            height: `${dot}px`,
                            borderRadius: '50%',
                            background:
                                'var(--ds-color-accent-background)',
                        }}
                    />
                )}
            </span>
            {label && <span style={{ lineHeight: 1.4 }}>{label}</span>}
        </label>
    )
}
