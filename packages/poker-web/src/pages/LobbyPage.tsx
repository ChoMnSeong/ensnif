import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card, Stack } from '@ensnif/design-system'
import { useAuth } from '../lib/auth'
import { useLobby } from '../lib/socket'
import { fmtChips } from '../lib/format'

export function LobbyPage() {
    const { user, logout, refresh } = useAuth()
    const tables = useLobby()
    const navigate = useNavigate()

    // Refresh the bankroll whenever we return to the lobby.
    useEffect(() => {
        void refresh()
    }, [refresh])

    return (
        <div style={{ minHeight: '100dvh', background: 'var(--ds-color-background-page)' }}>
            <header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--ds-color-border-subtle)',
                    position: 'sticky',
                    top: 0,
                    background: 'var(--ds-color-background-page)',
                    zIndex: 10,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18 }}>
                    <span>♠️</span> Hold'em 로비
                </div>
                <Stack direction="row" gap={14} align="center">
                    <div style={{ textAlign: 'right', lineHeight: 1.2 }}>
                        <div style={{ fontSize: 13, color: 'var(--ds-color-foreground-secondary)' }}>
                            {user?.username}
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--ds-palette-primary-400)' }}>
                            🪙 {fmtChips(user?.chips ?? 0)}
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={logout}>
                        로그아웃
                    </Button>
                </Stack>
            </header>

            <main style={{ maxWidth: 980, margin: '0 auto', padding: 20 }}>
                <h2 style={{ margin: '6px 2px 16px', fontSize: 16, color: 'var(--ds-color-foreground-secondary)' }}>
                    테이블 선택
                </h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: 14,
                    }}
                >
                    {tables.length === 0 && (
                        <p style={{ color: 'var(--ds-color-foreground-tertiary)' }}>테이블을 불러오는 중…</p>
                    )}
                    {tables.map((t) => {
                        const full = t.seatedCount >= t.maxSeats
                        const affordable = (user?.chips ?? 0) >= t.minBuyIn
                        return (
                            <Card key={t.id} surface="card" padded>
                                <Stack direction="column" gap={12}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                                        {t.inHand ? (
                                            <Badge tone="success" size="sm" dot>
                                                진행중
                                            </Badge>
                                        ) : (
                                            <Badge tone="default" size="sm">
                                                대기
                                            </Badge>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 13, color: 'var(--ds-color-foreground-secondary)' }}>
                                        블라인드 {fmtChips(t.smallBlind)}/{fmtChips(t.bigBlind)} · 바이인{' '}
                                        {fmtChips(t.minBuyIn)}~{fmtChips(t.maxBuyIn)}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: 13, color: 'var(--ds-color-foreground-tertiary)' }}>
                                            👤 {t.seatedCount}/{t.maxSeats}
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            disabled={full || !affordable}
                                            onClick={() => navigate(`/table/${t.id}`)}
                                        >
                                            {full ? '만석' : !affordable ? '칩 부족' : '앉기'}
                                        </Button>
                                    </div>
                                </Stack>
                            </Card>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
