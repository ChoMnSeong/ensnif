import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tv2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { adminSignin } from '@/libs/apis/auth'

export default function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            const data = await adminSignin({ email, password })
            localStorage.setItem('adminToken', data.accessToken)
            navigate('/')
        } catch {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="mb-2 flex justify-center">
                        <Tv2 className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Lanime Admin</CardTitle>
                    <CardDescription>관리자 계정으로 로그인하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="email">이메일</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="password">비밀번호</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? '로그인 중...' : '로그인'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
