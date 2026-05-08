import {
    createContext,
    useContext,
    useState,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
} from 'react'
import { mergeStyles } from './types.js'

type TabsContext = {
    value: string
    setValue: (v: string) => void
    variant: 'underline' | 'pill'
}

const Ctx = createContext<TabsContext | null>(null)

export type TabsProps = {
    value?: string
    defaultValue?: string
    onValueChange?: (v: string) => void
    variant?: 'underline' | 'pill'
    children: ReactNode
    style?: CSSProperties
}

export const Tabs = ({
    value: controlledValue,
    defaultValue,
    onValueChange,
    variant = 'underline',
    children,
    style,
}: TabsProps) => {
    const [internal, setInternal] = useState(defaultValue ?? '')
    const value = controlledValue ?? internal
    const setValue = (v: string) => {
        if (controlledValue === undefined) setInternal(v)
        onValueChange?.(v)
    }
    return (
        <Ctx.Provider value={{ value, setValue, variant }}>
            <div style={style}>{children}</div>
        </Ctx.Provider>
    )
}

export const TabList = ({ style, ...rest }: HTMLAttributes<HTMLDivElement>) => {
    const ctx = useContext(Ctx)!
    return (
        <div
            role="tablist"
            style={mergeStyles(
                {
                    display: 'flex',
                    gap: ctx.variant === 'pill' ? '4px' : '0',
                    borderBottom:
                        ctx.variant === 'underline'
                            ? '1px solid var(--ds-color-border-subtle)'
                            : 'none',
                    background:
                        ctx.variant === 'pill'
                            ? 'var(--ds-color-background-inset)'
                            : 'transparent',
                    padding: ctx.variant === 'pill' ? '4px' : '0',
                    borderRadius:
                        ctx.variant === 'pill'
                            ? 'var(--ds-radius-md)'
                            : '0',
                    width: ctx.variant === 'pill' ? 'fit-content' : '100%',
                },
                style,
            )}
            {...rest}
        />
    )
}

export type TabProps = {
    value: string
    children: ReactNode
    disabled?: boolean
} & Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'>

export const Tab = ({ value, children, disabled, style, ...rest }: TabProps) => {
    const ctx = useContext(Ctx)!
    const active = ctx.value === value
    const baseStyle: CSSProperties = {
        padding:
            ctx.variant === 'underline' ? '10px 14px' : '6px 14px',
        fontSize: '13px',
        fontWeight: active ? 600 : 500,
        background:
            active && ctx.variant === 'pill'
                ? 'var(--ds-color-background-card)'
                : 'transparent',
        color: active
            ? 'var(--ds-color-foreground-primary)'
            : 'var(--ds-color-foreground-tertiary)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        borderRadius:
            ctx.variant === 'pill' ? 'var(--ds-radius-sm)' : 0,
        boxShadow:
            active && ctx.variant === 'pill'
                ? '0 1px 2px rgba(0, 0, 0, 0.06)'
                : 'none',
        position: 'relative',
        transition: 'all 120ms ease',
    }
    return (
        <button
            role="tab"
            type="button"
            aria-selected={active}
            disabled={disabled}
            data-ds-focusable=""
            onClick={() => !disabled && ctx.setValue(value)}
            style={mergeStyles(baseStyle, style)}
            {...rest}
        >
            {children}
            {active && ctx.variant === 'underline' && (
                <span
                    aria-hidden
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: '-1px',
                        height: '2px',
                        background:
                            'var(--ds-color-accent-background)',
                    }}
                />
            )}
        </button>
    )
}

export type TabPanelProps = {
    value: string
    children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export const TabPanel = ({ value, children, style, ...rest }: TabPanelProps) => {
    const ctx = useContext(Ctx)!
    if (ctx.value !== value) return null
    return (
        <div
            role="tabpanel"
            style={mergeStyles({ paddingTop: '16px' }, style)}
            {...rest}
        >
            {children}
        </div>
    )
}
