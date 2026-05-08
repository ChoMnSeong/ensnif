import {
    groupLabels,
    groupOrder,
    routes,
    type RouteId,
    type RouteMeta,
} from '../router/routes'

type Props = {
    current: RouteId
    onSelect: (id: RouteId) => void
}

export const Sidebar = ({ current, onSelect }: Props) => {
    const grouped = groupOrder.map((g) => ({
        group: g,
        items: routes.filter((r) => r.group === g),
    }))

    return (
        <aside
            style={{
                position: 'sticky',
                top: '57px',
                alignSelf: 'start',
                height: 'calc(100vh - 57px)',
                overflowY: 'auto',
                padding: '24px 18px',
                borderRight: '1px solid var(--ds-color-border-subtle)',
                background: 'var(--ds-color-background-page)',
            }}
        >
            {grouped.map(
                (g) =>
                    g.items.length > 0 && (
                        <NavGroup
                            key={g.group}
                            title={groupLabels[g.group as RouteMeta['group']]}
                        >
                            {g.items.map((r) => (
                                <NavItem
                                    key={r.id}
                                    active={current === r.id}
                                    onClick={() => onSelect(r.id)}
                                >
                                    {r.label}
                                </NavItem>
                            ))}
                        </NavGroup>
                    ),
            )}
        </aside>
    )
}

const NavGroup = ({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) => (
    <div style={{ marginBottom: '24px' }}>
        <div
            style={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--ds-color-foreground-tertiary)',
                marginBottom: '8px',
                paddingLeft: '10px',
            }}
        >
            {title}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {children}
        </div>
    </div>
)

const NavItem = ({
    active,
    onClick,
    children,
}: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
}) => (
    <button
        onClick={onClick}
        style={{
            display: 'block',
            width: '100%',
            padding: '6px 10px',
            textAlign: 'left',
            background: active
                ? 'var(--ds-color-background-inset)'
                : 'transparent',
            color: active
                ? 'var(--ds-color-foreground-primary)'
                : 'var(--ds-color-foreground-secondary)',
            border: 'none',
            borderRadius: 'var(--ds-radius-sm)',
            fontSize: '13px',
            fontWeight: active ? 600 : 400,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 80ms ease',
        }}
    >
        {children}
    </button>
)
