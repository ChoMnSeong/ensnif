import {
    useState,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
} from 'react'
import { mergeStyles } from './types.js'
import { IconChevronRight } from './icons.js'

export type NavItem = {
    id: string
    label: ReactNode
    icon?: ReactNode
    badge?: ReactNode
    href?: string
    onClick?: () => void
    children?: NavItem[]
}

export type NavigationMenuProps = {
    items: NavItem[]
    activeId?: string
    defaultExpanded?: string[]
    style?: CSSProperties
} & Omit<HTMLAttributes<HTMLElement>, 'children'>

export const NavigationMenu = ({
    items,
    activeId,
    defaultExpanded = [],
    style,
    ...rest
}: NavigationMenuProps) => {
    const [expanded, setExpanded] = useState<Set<string>>(
        () => new Set(defaultExpanded),
    )

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    return (
        <nav
            style={mergeStyles(
                {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    fontFamily: 'inherit',
                    fontSize: '13px',
                },
                style,
            )}
            {...rest}
        >
            {items.map((it) => (
                <NavItemRow
                    key={it.id}
                    item={it}
                    depth={0}
                    activeId={activeId}
                    expanded={expanded}
                    onToggle={toggle}
                />
            ))}
        </nav>
    )
}

const NavItemRow = ({
    item,
    depth,
    activeId,
    expanded,
    onToggle,
}: {
    item: NavItem
    depth: number
    activeId?: string
    expanded: Set<string>
    onToggle: (id: string) => void
}) => {
    const hasChildren = !!item.children && item.children.length > 0
    const isOpen = expanded.has(item.id)
    const isActive = activeId === item.id

    const baseStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 10px',
        paddingLeft: `${10 + depth * 14}px`,
        background: isActive
            ? 'var(--ds-color-background-inset)'
            : 'transparent',
        color: isActive
            ? 'var(--ds-color-foreground-primary)'
            : 'var(--ds-color-foreground-secondary)',
        border: 'none',
        borderRadius: 'var(--ds-radius-sm)',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        fontWeight: isActive ? 600 : 500,
        textAlign: 'left',
        textDecoration: 'none',
        width: '100%',
        transition: 'background 80ms ease',
    }

    const inner = (
        <>
            {item.icon && (
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: 'var(--ds-color-foreground-tertiary)',
                        flexShrink: 0,
                    }}
                >
                    {item.icon}
                </span>
            )}
            <span style={{ flex: 1, minWidth: 0 }}>{item.label}</span>
            {item.badge && (
                <span
                    style={{
                        fontSize: '10px',
                        padding: '1px 6px',
                        background: 'var(--ds-color-background-inset)',
                        border: '1px solid var(--ds-color-border-subtle)',
                        borderRadius: 'var(--ds-radius-full)',
                        color: 'var(--ds-color-foreground-tertiary)',
                        flexShrink: 0,
                    }}
                >
                    {item.badge}
                </span>
            )}
            {hasChildren && (
                <span
                    aria-hidden
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: 'var(--ds-color-foreground-muted)',
                        transform: isOpen ? 'rotate(90deg)' : 'none',
                        transition: 'transform 120ms ease',
                        flexShrink: 0,
                    }}
                >
                    <IconChevronRight size={12} />
                </span>
            )}
        </>
    )

    return (
        <>
            {item.href && !hasChildren ? (
                <a
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    style={baseStyle}
                    data-ds-focusable=""
                >
                    {inner}
                </a>
            ) : (
                <button
                    type="button"
                    onClick={() => {
                        if (hasChildren) onToggle(item.id)
                        item.onClick?.()
                    }}
                    aria-expanded={hasChildren ? isOpen : undefined}
                    style={baseStyle}
                    data-ds-focusable=""
                >
                    {inner}
                </button>
            )}
            {hasChildren && isOpen && (
                <div role="group">
                    {item.children!.map((c) => (
                        <NavItemRow
                            key={c.id}
                            item={c}
                            depth={depth + 1}
                            activeId={activeId}
                            expanded={expanded}
                            onToggle={onToggle}
                        />
                    ))}
                </div>
            )}
        </>
    )
}
