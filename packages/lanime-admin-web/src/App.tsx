import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AdminLayout from '@libs/layouts/AdminLayout'
import LoginPage from '@pages/LoginPage'
import DashboardPage from '@pages/DashboardPage'
import AnimationsPage from '@pages/AnimationsPage'
import EpisodesPage from '@pages/EpisodesPage'
import AdminAccountsPage from '@pages/AdminAccountsPage'
import BannersPage from '@pages/BannersPage'
import type { RootState } from '@stores/index'

function RequireAuth({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useSelector((state: RootState) => state.adminAuth.isAuthenticated)
    if (!isAuthenticated) return <Navigate to="/login" replace />
    return <>{children}</>
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/"
                element={
                    <RequireAuth>
                        <AdminLayout />
                    </RequireAuth>
                }
            >
                <Route index element={<DashboardPage />} />
                <Route path="animations" element={<AnimationsPage />} />
                <Route path="animations/:animationId/episodes" element={<EpisodesPage />} />
                <Route path="banners" element={<BannersPage />} />
                <Route path="accounts" element={<AdminAccountsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
