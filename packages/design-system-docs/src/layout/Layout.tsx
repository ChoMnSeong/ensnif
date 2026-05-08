import { useState, type ReactNode } from 'react'
import { TopNav } from './TopNav'
import { Sidebar } from './Sidebar'
import { ThemeDrawer } from './ThemeDrawer'
import type { RouteId } from '../router/routes'

type Props = {
    route: RouteId
    onNavigate: (id: RouteId) => void
    children: ReactNode
}

export const Layout = ({ route, onNavigate, children }: Props) => {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--ds-color-background-page)',
                color: 'var(--ds-color-foreground-primary)',
            }}
        >
            <TopNav onOpenSettings={() => setDrawerOpen(true)} />
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '240px 1fr',
                }}
            >
                <Sidebar current={route} onSelect={onNavigate} />
                <main
                    style={{
                        padding: '40px 56px 80px',
                        maxWidth: '1100px',
                        width: '100%',
                    }}
                >
                    {children}
                </main>
            </div>
            <ThemeDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </div>
    )
}
