import { type ReactNode } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { Spinner } from '@ensnif/design-system'
import { useAuth } from './lib/auth'
import { AuthPage } from './pages/AuthPage'
import { LobbyPage } from './pages/LobbyPage'
import { TablePage } from './pages/TablePage'

function RequireAuth({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth()
    if (loading) {
        return (
            <div style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh' }}>
                <Spinner size="lg" />
            </div>
        )
    }
    if (!user) return <Navigate to="/login" replace />
    return <>{children}</>
}

export const router = createBrowserRouter([
    { path: '/login', element: <AuthPage /> },
    {
        path: '/lobby',
        element: (
            <RequireAuth>
                <LobbyPage />
            </RequireAuth>
        ),
    },
    {
        path: '/table/:tableId',
        element: (
            <RequireAuth>
                <TablePage />
            </RequireAuth>
        ),
    },
    { path: '/', element: <Navigate to="/lobby" replace /> },
    { path: '*', element: <Navigate to="/lobby" replace /> },
])
