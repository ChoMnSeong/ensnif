import { Film, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { useAdminAnimations, useAdminAccounts } from '@libs/apis/admin'

export default function DashboardContainer() {
    const { data: animations = [] } = useAdminAnimations()
    const { data: accounts = [] } = useAdminAccounts()

    const stats = [
        {
            label: '전체 애니메이션',
            value: animations.length,
            icon: Film,
            desc: '등록된 애니메이션 수',
        },
        {
            label: '관리자 계정',
            value: accounts.length,
            icon: Users,
            desc: '활성 관리자 수',
        },
    ]

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
                <p className="text-muted-foreground">Lanime 관리자 패널에 오신 것을 환영합니다.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map(({ label, value, icon: Icon, desc }) => (
                    <Card key={label}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{value}</p>
                            <p className="text-xs text-muted-foreground">{desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
