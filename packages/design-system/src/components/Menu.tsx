import {
    cloneElement,
    isValidElement,
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type HTMLAttributes,
    type ReactElement,
    type ReactNode,
} from 'react'
import { Popover } from './Popover.js'
import { useOutsideClick } from './useOutsideClick.js'
import { mergeStyles } from './types.js'

export type MenuProps = {
    trigger: ReactElement<any>
    children: ReactNode
    align?: 'start' | 'center' | 'end'
    placement?: 'auto' | 'top' | 'bottom'
    minWidth?: number
}

export const Menu = ({
    trigger,
    children,
    align = 'start',
    placement = 'auto',
    minWidth = 180,
}: MenuProps) => {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLElement | null>(null)
    const popoverRef = useRef<HTMLDivElement | null>(null)

    useOutsideClick([popoverRef, triggerRef], () => setOpen(false), open)

    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open])

    const child = isValidElement(trigger) ? trigger : null
    if (!child) return <>{trigger}</>
    const childProps = (child.props ?? {}) as Record<string, unknown>

    const enhanced = cloneElement(child, {
        ref: (node: HTMLElement | null) => {
            triggerRef.current = node
            const orig = (child as { ref?: unknown }).ref
            if (typeof orig === 'function') orig(node)
            else if (orig && typeof orig === 'object' && 'current' in orig) {
                ;(orig as { current: HTMLElement | null }).current = node
            }
        },
        onClick: (e: unknown) => {
            const fn = childProps.onClick as ((e: unknown) => void) | undefined
            fn?.(e)
            setOpen((v) => !v)
        },
    } as never)

    return (
        <>
            {enhanced}
            <Popover
                open={open}
                triggerRef={triggerRef}
                offset={6}
                align={align}
                placement={placement}
                minWidth={minWidth}
            >
                <div
                    ref={popoverRef}
                    role="menu"
                    onClick={() => setOpen(false)}
                    style={{
                        background: 'var(--ds-surface-overlay-background)',
                        backdropFilter:
                            'var(--ds-surface-overlay-backdrop-filter)',
                        border: 'var(--ds-surface-overlay-border)',
                        borderRadius: 'var(--ds-surface-overlay-radius)',
                        boxShadow: 'var(--ds-surface-overlay-shadow)',
                        padding: '4px',
                        minWidth: `${minWidth}px`,
                    }}
                >
                    {children}
                </div>
            </Popover>
        </>
    )
}

export type MenuItemProps = {
    icon?: ReactNode
    shortcut?: ReactNode
    danger?: boolean
    disabled?: boolean
} & HTMLAttributes<HTMLButtonElement>

export const MenuItem = ({
    icon,
    shortcut,
    danger,
    disabled,
    children,
    style,
    ...rest
}: MenuItemProps) => (
    <button
        type="button"
        role="menuitem"
        disabled={disabled}
        data-ds-focusable=""
        style={mergeStyles(
            {
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '7px 10px',
                background: 'transparent',
                color: danger
                    ? 'var(--ds-color-state-danger)'
                    : disabled
                      ? 'var(--ds-color-foreground-muted)'
                      : 'var(--ds-color-foreground-primary)',
                border: 'none',
                borderRadius: 'var(--ds-radius-sm)',
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: 500,
                cursor: disabled ? 'not-allowed' : 'pointer',
                textAlign: 'left',
            },
            style,
        )}
        onMouseEnter={(e) => {
            if (!disabled) {
                e.currentTarget.style.background =
                    'var(--ds-color-background-inset)'
            }
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
        }}
        {...rest}
    >
        {icon && (
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: 'currentColor',
                    flexShrink: 0,
                }}
            >
                {icon}
            </span>
        )}
        <span style={{ flex: 1 }}>{children}</span>
        {shortcut && (
            <span
                style={{
                    fontSize: '11px',
                    color: 'var(--ds-color-foreground-tertiary)',
                    fontFamily: 'var(--ds-typography-fontFamily-mono)',
                }}
            >
                {shortcut}
            </span>
        )}
    </button>
)

export const MenuSeparator = ({ style, ...rest }: HTMLAttributes<HTMLDivElement>) => (
    <div
        role="separator"
        style={mergeStyles(
            {
                height: '1px',
                background: 'var(--ds-color-border-subtle)',
                margin: '4px 0',
            },
            style,
        )}
        {...rest}
    />
)

export const MenuLabel = ({
    style,
    ...rest
}: HTMLAttributes<HTMLDivElement>) => (
    <div
        style={mergeStyles(
            {
                padding: '6px 10px 4px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--ds-color-foreground-tertiary)',
            },
            style,
        )}
        {...rest}
    />
)

const _unused: CSSProperties = {} // type guard
void _unused
