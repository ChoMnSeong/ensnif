import { Film, Users, LayoutDashboard, Image } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface IAdminRoute {
    path: string
    label: string
    icon: LucideIcon
}

const adminRouters: IAdminRoute[] = [
    { path: '/', label: '대시보드', icon: LayoutDashboard },
    { path: '/animations', label: '애니메이션', icon: Film },
    { path: '/banners', label: '광고 배너', icon: Image },
    { path: '/accounts', label: '관리자 계정', icon: Users },
]

export default adminRouters
