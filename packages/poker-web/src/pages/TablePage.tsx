import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, Card, Input, Stack } from '@ensnif/design-system'
import { useAuth } from '../lib/auth'
import { useLobby, useTable } from '../lib/socket'
import { fmtChips } from '../lib/format'
import { PokerTable } from '../components/PokerTable'
import { ActionBar } from '../components/ActionBar'

export function TablePage() {
    const { tableId = '' } = useParams()
    const navigate = useNavigate()
    const { user, refresh } = useAuth()
    const tables = useLobby()
    const t = useTable()

    const cfg = tables.find((x) => x.id === tableId)
    const seated = t.state !== null && t.state.tableId === tableId && t.state.yourSeat !== null

    const leaveAndExit = () => {
        t.leave()
        void refresh()
        navigate('/lobby')
    }

    if (!seated) {
        return (
            <BuyInPanel
                tableName={cfg?.name ?? tableId}
                minBuyIn={cfg?.minBuyIn ?? 0}
                maxBuyIn={cfg?.maxBuyIn ?? 0}
                bigBlind={cfg?.bigBlind ?? 1}
                chips={user?.chips ?? 0}
                onCancel={() => navigate('/lobby')}
                onJoin={async (amount) => {
                    await t.join(tableId, amount)
                    await refresh()
                }}
                error={t.error}
            />
        )
    }

    const state = t.state!
    const bb = state.config.bigBlind
    const heroSeat = state.seats.find((s) => s.isYou)

    return (
        <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--ds-color-background-page)' }}>
            {/* Top bar */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    borderBottom: '1px solid var(--ds-color-border-subtle)',
                }}
            >
                <Stack direction="row" gap={10} align="center">
                    <Button variant="ghost" size="sm" onClick={leaveAndExit}>
                        ← 나가기
                    </Button>
                    <strong>{state.name}</strong>
                    <Badge tone="default" size="sm">
                        {fmtChips(state.config.smallBlind)}/{fmtChips(bb)}
                    </Badge>
                </Stack>
                <Stack direction="row" gap={8} align="center">
                    <span style={{ fontSize: 13, color: 'var(--ds-color-foreground-secondary)' }}>
                        뱅크롤 🪙 {fmtChips(user?.chips ?? 0)}
                    </span>
                    <SitOutButton sittingOut={heroSeat?.sittingOut ?? false} onToggle={(v) => t.sitOut(v)} />
                </Stack>
            </div>

            {/* Main: table + side panel */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
                <div style={{ flex: 1, minWidth: 0, position: 'relative', display: 'grid', placeItems: 'center', padding: 12 }}>
                    <PokerTable state={state} />
                    {t.error && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 14,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'var(--ds-color-state-danger)',
                                color: '#fff',
                                padding: '6px 14px',
                                borderRadius: 'var(--ds-radius-full)',
                                fontSize: 13,
                            }}
                        >
                            {t.error}
                        </div>
                    )}
                </div>
                <SidePanel controller={t} />
            </div>

            {/* Action bar */}
            <div style={{ borderTop: '1px solid var(--ds-color-border-subtle)', padding: 12, minHeight: 84 }}>
                {state.yourLegalActions ? (
                    <ActionBar
                        legal={state.yourLegalActions}
                        betToCall={state.betToCall}
                        pot={state.totalPot}
                        bigBlind={bb}
                        onAction={t.act}
                    />
                ) : (
                    <RebuyOrWait state={state} controller={t} />
                )}
            </div>
        </div>
    )
}

function SitOutButton({ sittingOut, onToggle }: { sittingOut: boolean; onToggle: (v: boolean) => void }) {
    return (
        <Button variant={sittingOut ? 'warning' : 'ghost'} size="sm" onClick={() => onToggle(!sittingOut)}>
            {sittingOut ? '참여하기' : '관전(쉬기)'}
        </Button>
    )
}

function RebuyOrWait({
    state,
    controller,
}: {
    state: NonNullable<ReturnType<typeof useTable>['state']>
    controller: ReturnType<typeof useTable>
}) {
    const hero = state.seats.find((s) => s.isYou)
    const canRebuy = hero && hero.stack < state.config.maxBuyIn
    const [amount, setAmount] = useState(state.config.bigBlind * 50)

    if (hero && hero.stack === 0 && canRebuy) {
        return (
            <Stack direction="row" gap={10} align="center" justify="center">
                <span style={{ color: 'var(--ds-color-foreground-secondary)', fontSize: 14 }}>
                    스택이 0입니다. 리바이하세요.
                </span>
                <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    style={{ width: 120 }}
                />
                <Button variant="primary" size="sm" onClick={() => void controller.rebuy(amount).catch(() => {})}>
                    리바이
                </Button>
            </Stack>
        )
    }

    return (
        <div style={{ textAlign: 'center', color: 'var(--ds-color-foreground-tertiary)', fontSize: 14, paddingTop: 6 }}>
            {state.phase === 'waiting' ? '다음 핸드를 기다리는 중…' : '상대 액션을 기다리는 중…'}
        </div>
    )
}

function SidePanel({ controller }: { controller: ReturnType<typeof useTable> }) {
    const [tab, setTab] = useState<'log' | 'chat'>('log')
    const [msg, setMsg] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
    }, [controller.log, controller.chat, tab])

    const send = (e: FormEvent) => {
        e.preventDefault()
        const text = msg.trim()
        if (!text) return
        controller.sendChat(text)
        setMsg('')
    }

    return (
        <aside
            style={{
                width: 280,
                borderLeft: '1px solid var(--ds-color-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--ds-color-background-card)',
            }}
        >
            <Stack direction="row" gap={0}>
                <TabButton active={tab === 'log'} onClick={() => setTab('log')}>
                    핸드 로그
                </TabButton>
                <TabButton active={tab === 'chat'} onClick={() => setTab('chat')}>
                    채팅
                </TabButton>
            </Stack>
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '8px 12px', fontSize: 13 }}>
                {tab === 'log'
                    ? controller.log.map((e) => (
                          <div key={e.id} style={{ padding: '2px 0', color: logColor(e.kind) }}>
                              {e.text}
                          </div>
                      ))
                    : controller.chat.map((m, i) => (
                          <div key={i} style={{ padding: '2px 0' }}>
                              <span style={{ color: 'var(--ds-palette-primary-400)', fontWeight: 600 }}>{m.name}</span>{' '}
                              <span style={{ color: 'var(--ds-color-foreground-secondary)' }}>{m.message}</span>
                          </div>
                      ))}
            </div>
            {tab === 'chat' && (
                <form onSubmit={send} style={{ padding: 10, borderTop: '1px solid var(--ds-color-border-subtle)' }}>
                    <Stack direction="row" gap={6}>
                        <Input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="메시지…" fullWidth />
                        <Button type="submit" size="sm" variant="primary">
                            전송
                        </Button>
                    </Stack>
                </form>
            )}
        </aside>
    )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1,
                padding: '10px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: active ? '2px solid var(--ds-palette-primary-500)' : '2px solid transparent',
                color: active ? 'var(--ds-color-foreground-primary)' : 'var(--ds-color-foreground-tertiary)',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
            }}
        >
            {children}
        </button>
    )
}

function logColor(kind: string): string {
    switch (kind) {
        case 'result':
            return 'var(--ds-palette-primary-400)'
        case 'hand':
        case 'street':
            return 'var(--ds-color-foreground-secondary)'
        case 'system':
            return 'var(--ds-color-foreground-tertiary)'
        default:
            return 'var(--ds-color-foreground-primary)'
    }
}

function BuyInPanel({
    tableName,
    minBuyIn,
    maxBuyIn,
    bigBlind,
    chips,
    onJoin,
    onCancel,
    error,
}: {
    tableName: string
    minBuyIn: number
    maxBuyIn: number
    bigBlind: number
    chips: number
    onJoin: (amount: number) => Promise<void>
    onCancel: () => void
    error: string | null
}) {
    const cap = Math.min(maxBuyIn, chips)
    const [amount, setAmount] = useState(() => Math.min(Math.max(bigBlind * 100, minBuyIn), cap || maxBuyIn))
    const [busy, setBusy] = useState(false)
    const [localError, setLocalError] = useState<string | null>(null)

    const tooPoor = chips < minBuyIn
    const valid = amount >= minBuyIn && amount <= cap

    const join = async () => {
        setBusy(true)
        setLocalError(null)
        try {
            await onJoin(amount)
        } catch (e) {
            setLocalError(e instanceof Error ? e.message : '입장에 실패했습니다')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 24, background: 'var(--ds-color-background-page)' }}>
            <Card surface="panel" padded style={{ width: 'min(420px, 92vw)' }}>
                <Stack direction="column" gap={16}>
                    <div>
                        <h2 style={{ margin: '0 0 4px' }}>{tableName}</h2>
                        <p style={{ margin: 0, fontSize: 13, color: 'var(--ds-color-foreground-secondary)' }}>
                            바이인 범위 {fmtChips(minBuyIn)} ~ {fmtChips(maxBuyIn)} · 보유 🪙 {fmtChips(chips)}
                        </p>
                    </div>

                    {tooPoor ? (
                        <div style={{ color: 'var(--ds-color-state-danger)', fontSize: 14 }}>
                            이 테이블에 앉기엔 칩이 부족합니다.
                        </div>
                    ) : (
                        <>
                            <Stack direction="column" gap={8}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                    <span style={{ color: 'var(--ds-color-foreground-secondary)' }}>바이인 금액</span>
                                    <strong>{fmtChips(amount)}</strong>
                                </div>
                                <input
                                    type="range"
                                    min={minBuyIn}
                                    max={cap}
                                    step={bigBlind}
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--ds-palette-primary-500)' }}
                                />
                                <Stack direction="row" gap={6}>
                                    <Button size="sm" variant="ghost" onClick={() => setAmount(minBuyIn)}>
                                        최소
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setAmount(Math.min(bigBlind * 100, cap))}>
                                        100BB
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setAmount(cap)}>
                                        최대
                                    </Button>
                                </Stack>
                            </Stack>

                            {(localError || error) && (
                                <div style={{ color: 'var(--ds-color-state-danger)', fontSize: 13 }}>
                                    {localError || error}
                                </div>
                            )}
                        </>
                    )}

                    <Stack direction="row" gap={8}>
                        <Button variant="ghost" fullWidth onClick={onCancel}>
                            취소
                        </Button>
                        <Button
                            variant="primary"
                            fullWidth
                            disabled={tooPoor || !valid || busy}
                            loading={busy}
                            onClick={join}
                        >
                            앉기
                        </Button>
                    </Stack>
                </Stack>
            </Card>
        </div>
    )
}
