import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Input, Stack } from '@ensnif/design-system'
import { useAuth } from '../lib/auth'
import { apiError } from '../lib/api'

export function AuthPage() {
    const { user, login, register } = useAuth()
    const navigate = useNavigate()
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (user) navigate('/lobby', { replace: true })
    }, [user, navigate])

    const submit = async (e: FormEvent) => {
        e.preventDefault()
        setBusy(true)
        setError(null)
        try {
            if (mode === 'login') await login(username.trim(), password)
            else await register(username.trim(), password)
            navigate('/lobby', { replace: true })
        } catch (err) {
            setError(apiError(err))
        } finally {
            setBusy(false)
        }
    }

    return (
        <div
            style={{
                minHeight: '100dvh',
                display: 'grid',
                placeItems: 'center',
                padding: 24,
                background:
                    'radial-gradient(1200px 600px at 50% -10%, rgba(34,139,94,0.18), transparent), var(--ds-color-background-page)',
            }}
        >
            <Card surface="panel" padded style={{ width: 'min(380px, 92vw)' }}>
                <Stack direction="column" gap={20}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 34, lineHeight: 1 }}>♠️</div>
                        <h1 style={{ margin: '10px 0 2px', fontSize: 22 }}>Hold'em</h1>
                        <p style={{ margin: 0, color: 'var(--ds-color-foreground-secondary)', fontSize: 13 }}>
                            가상 코인 텍사스 홀덤
                        </p>
                    </div>

                    <Stack direction="row" gap={8}>
                        <Button
                            type="button"
                            fullWidth
                            variant={mode === 'login' ? 'primary' : 'ghost'}
                            onClick={() => setMode('login')}
                        >
                            로그인
                        </Button>
                        <Button
                            type="button"
                            fullWidth
                            variant={mode === 'register' ? 'primary' : 'ghost'}
                            onClick={() => setMode('register')}
                        >
                            회원가입
                        </Button>
                    </Stack>

                    <form onSubmit={submit}>
                        <Stack direction="column" gap={12}>
                            <Input
                                placeholder="아이디"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                fullWidth
                            />
                            <Input
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                fullWidth
                            />
                            {error && (
                                <div style={{ color: 'var(--ds-color-state-danger)', fontSize: 13 }}>{error}</div>
                            )}
                            <Button type="submit" variant="primary" fullWidth loading={busy} disabled={busy}>
                                {mode === 'login' ? '로그인' : '가입하고 시작하기'}
                            </Button>
                        </Stack>
                    </form>

                    {mode === 'register' && (
                        <p style={{ margin: 0, fontSize: 12, color: 'var(--ds-color-foreground-tertiary)', textAlign: 'center' }}>
                            가입하면 10,000 칩을 무료로 드립니다 🎁
                        </p>
                    )}
                </Stack>
            </Card>
        </div>
    )
}
