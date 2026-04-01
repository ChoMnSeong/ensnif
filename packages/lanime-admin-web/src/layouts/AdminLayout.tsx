import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Film, Users, LayoutDashboard, LogOut, Tv2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const navItems = [
    { to: '/', icon: LayoutDashboard, label: '대시보드' },
    { to: '/animations', icon: Film, label: '애니메이션' },
    { to: '/accounts', icon: Users, label: '관리자 계정' },
]

export default function AdminLayout() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        navigate('/login')
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className="flex w-60 flex-col border-r bg-card">
                <div className="flex h-16 items-center gap-2 px-6">
                    <Tv2 className="h-6 w-6 text-primary" />
                    <Link to="/" className="text-lg font-bold tracking-tight">
                        Lanime Admin
                    </Link>
                </div>
                <Separator />
                <nav className="flex flex-1 flex-col gap-1 p-3">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                )
                            }
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>
                <Separator />
                <div className="p-3">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        로그아웃
                    </Button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
