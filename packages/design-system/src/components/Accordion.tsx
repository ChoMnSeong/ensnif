import {
    createContext,
    useContext,
    useState,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
} from 'react'
import { IconChevronDown } from './icons.js'
import { mergeStyles } from './types.js'
import { type BorderVariant } from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

type AccordionContextValue = {
    type: 'single' | 'multiple'
    open: string[]
    toggle: (value: string) => void
}

const Ctx = createContext<AccordionContextValue | null>(null)

export type AccordionProps = {
    type?: 'single' | 'multiple'
    value?: string | string[]
    defaultValue?: string | string[]
    onValueChange?: (value: string | string[]) => void
    variant?: BorderVariant
    children: ReactNode
    style?: CSSProperties
}

const wrapperStyle = (variant: BorderVariant): CSSProperties => {
    switch (variant) {
        case 'underline':
            return {
                background: 'transparent',
                border: 'none',
                borderTop: '1px solid var(--ds-color-border-subtle)',
                borderRadius: 0,
                overflow: 'visible',
            }
        case 'filled':
            return {
                background: 'var(--ds-color-background-inset)',
                border: 'none',
                borderRadius: 'var(--ds-radius-md)',
                overflow: 'hidden',
            }
        case 'ghost':
            return {
                background: 'transparent',
                border: 'none',
                borderRadius: 0,
                overflow: 'visible',
            }
        case 'outlined':
        default:
            return {
                background: 'var(--ds-color-background-card)',
                border: '1px solid var(--ds-color-border-subtle)',
                borderRadius: 'var(--ds-radius-md)',
                overflow: 'hidden',
            }
    }
}

export const Accordion = ({
    type = 'single',
    value,
    defaultValue,
    onValueChange,
    variant: variantProp,
    children,
    style,
}: AccordionProps) => {
    const variant = useBorderVariant(variantProp)
    const initial: string[] =
        defaultValue === undefined
            ? []
            : Array.isArray(defaultValue)
              ? defaultValue
              : [defaultValue]
    const [internal, setInternal] = useState<string[]>(initial)
    const controlled =
        value === undefined
            ? null
            : Array.isArray(value)
              ? value
              : [value]
    const open = controlled ?? internal

    const toggle = (v: string) => {
        let next: string[]
        if (type === 'single') {
            next = open.includes(v) ? [] : [v]
        } else {
            next = open.includes(v)
                ? open.filter((x) => x !== v)
                : [...open, v]
        }
        if (controlled === null) setInternal(next)
        onValueChange?.(type === 'single' ? (next[0] ?? '') : next)
    }

    return (
        <Ctx.Provider value={{ type, open, toggle }}>
            <div style={mergeStyles(wrapperStyle(variant), style)}>{children}</div>
        </Ctx.Provider>
    )
}

export type AccordionItemProps = {
    value: string
    title: ReactNode
    children: ReactNode
} & Omit<HTMLAttributes<HTMLDivElement>, 'title'>

export const AccordionItem = ({
    value,
    title,
    children,
    style,
    ...rest
}: AccordionItemProps) => {
    const ctx = useContext(Ctx)!
    const isOpen = ctx.open.includes(value)
    return (
        <div
            style={mergeStyles(
                {
                    borderBottom: '1px solid var(--ds-color-border-subtle)',
                },
                style,
            )}
            {...rest}
        >
            <button
                type="button"
                onClick={() => ctx.toggle(value)}
                aria-expanded={isOpen}
                data-ds-focusable=""
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--ds-color-foreground-primary)',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'left',
                }}
            >
                <span>{title}</span>
                <IconChevronDown
                    size={16}
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 160ms ease',
                        color: 'var(--ds-color-foreground-tertiary)',
                    }}
                />
            </button>
            <div
                style={{
                    overflow: 'hidden',
                    maxHeight: isOpen ? '1000px' : '0',
                    transition: 'max-height 200ms ease',
                }}
            >
                <div
                    style={{
                        padding: '0 16px 14px',
                        fontSize: '13px',
                        color: 'var(--ds-color-foreground-secondary)',
                        lineHeight: 1.6,
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}
