import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '@/layouts/AdminLayout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import AnimationsPage from '@/pages/AnimationsPage'
import EpisodesPage from '@/pages/EpisodesPage'
import AdminAccountsPage from '@/pages/AdminAccountsPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem('adminToken')
    if (!token) return <Navigate to="/login" replace />
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
                <Route path="accounts" element={<AdminAccountsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
