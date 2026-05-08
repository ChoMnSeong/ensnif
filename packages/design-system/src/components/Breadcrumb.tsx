import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { IconChevronRight } from './icons.js'
import { mergeStyles } from './types.js'

export type BreadcrumbItem = {
    label: ReactNode
    href?: string
    onClick?: () => void
}

export type BreadcrumbProps = {
    items: BreadcrumbItem[]
    separator?: ReactNode
} & HTMLAttributes<HTMLElement>

const linkStyle = (active: boolean): CSSProperties => ({
    fontSize: '13px',
    fontWeight: active ? 600 : 500,
    color: active
        ? 'var(--ds-color-foreground-primary)'
        : 'var(--ds-color-foreground-tertiary)',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: active ? 'default' : 'pointer',
    fontFamily: 'inherit',
    textDecoration: 'none',
})

export const Breadcrumb = ({
    items,
    separator,
    style,
    ...rest
}: BreadcrumbProps) => (
    <nav
        aria-label="Breadcrumb"
        style={mergeStyles(
            { display: 'flex', alignItems: 'center', gap: '6px' },
            style,
        )}
        {...rest}
    >
        {items.map((item, idx) => {
            const isLast = idx === items.length - 1
            const node =
                item.href && !isLast ? (
                    <a href={item.href} style={linkStyle(false)}>
                        {item.label}
                    </a>
                ) : item.onClick && !isLast ? (
                    <button
                        type="button"
                        onClick={item.onClick}
                        style={linkStyle(false)}
                    >
                        {item.label}
                    </button>
                ) : (
                    <span aria-current={isLast ? 'page' : undefined} style={linkStyle(isLast)}>
                        {item.label}
                    </span>
                )
            return (
                <span
                    key={idx}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                    {node}
                    {!isLast && (
                        <span
                            aria-hidden
                            style={{
                                color: 'var(--ds-color-foreground-muted)',
                                display: 'inline-flex',
                            }}
                        >
                            {separator ?? <IconChevronRight size={14} />}
                        </span>
                    )}
                </span>
            )
        })}
    </nav>
)
