import { useState, type ReactNode } from 'react'

type Props = {
    title?: string
    description?: string
    code?: string
    children: ReactNode
}

export const ComponentPreview = ({
    title,
    description,
    code,
    children,
}: Props) => {
    const [tab, setTab] = useState<'preview' | 'code'>('preview')
    const [copied, setCopied] = useState(false)

    const onCopy = async () => {
        if (!code) return
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
    }

    return (
        <div style={{ marginBottom: '32px' }}>
            {(title || description) && (
                <div style={{ marginBottom: '12px' }}>
                    {title && (
                        <h3
                            style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                margin: '0 0 4px',
                                color: 'var(--ds-color-foreground-primary)',
                            }}
                        >
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p
                            style={{
                                fontSize: '13px',
                                margin: 0,
                                color: 'var(--ds-color-foreground-tertiary)',
                            }}
                        >
                            {description}
                        </p>
                    )}
                </div>
            )}

            <div
                style={{
                    // 원시 토큰으로 카드를 다시 조립하면 variant 의 테두리/그림자 성격이
                    // 전부 사라지고 어떤 variant 에서도 같은 헤어라인 카드로 보인다.
                    background: 'var(--ds-surface-card-background)',
                    backdropFilter: 'var(--ds-surface-card-backdrop-filter)',
                    border: 'var(--ds-surface-card-border)',
                    borderRadius: 'var(--ds-surface-card-radius)',
                    boxShadow: 'var(--ds-surface-card-shadow)',
                    color: 'var(--ds-surface-card-color)',
                    // 사각형인 내부 콘텐츠를 카드의 둥근 모서리에 맞춰 잘라낸다.
                    // 없으면 radius 가 큰 variant(retro 16px, neumorphism 20px)에서
                    // 탭 바와 프리뷰 영역이 보더 밖으로 삐져나온다.
                    // 요소 자신의 box-shadow 는 잘리지 않으므로 오프셋 그림자는 그대로 남는다.
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px 6px 16px',
                        // variant 의 테두리 두께/색을 그대로 쓴다. 1px 헤어라인으로 못박으면
                        // 브루탈리즘의 3px 검정 카드 안에서 이 줄만 부드럽게 떠 보인다.
                        borderBottom: 'var(--ds-surface-card-border)',
                        background: 'var(--ds-surface-inset-background)',
                    }}
                >
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <TabButton
                            active={tab === 'preview'}
                            onClick={() => setTab('preview')}
                        >
                            Preview
                        </TabButton>
                        {code && (
                            <TabButton
                                active={tab === 'code'}
                                onClick={() => setTab('code')}
                            >
                                Code
                            </TabButton>
                        )}
                    </div>
                    {code && tab === 'code' && (
                        <button
                            onClick={onCopy}
                            style={{
                                padding: '4px 10px',
                                fontSize: '11px',
                                fontWeight: 600,
                                background:
                                    'var(--ds-surface-card-background)',
                                color: 'var(--ds-color-foreground-secondary)',
                                border: 'var(--ds-surface-card-border)',
                                borderRadius: 'var(--ds-radius-sm)',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                            }}
                        >
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    )}
                </div>

                {tab === 'preview' ? (
                    <div
                        style={{
                            padding: '32px 24px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            minHeight: '160px',
                            // 페이지 배경을 여기에 다시 깔면, 그 값이 그라디언트인 variant 에서
                            // 프리뷰 박스마다 그라디언트가 자기 박스 기준으로 다시 시작한다.
                            // 카드 표면이 그대로 비치도록 투명하게 둔다.
                            background: 'transparent',
                        }}
                    >
                        {children}
                    </div>
                ) : (
                    <pre
                        data-ds-scrollbar=""
                        style={{
                            margin: 0,
                            padding: '20px 24px',
                            fontSize: '12px',
                            fontFamily:
                                'var(--ds-typography-font-family-mono)',
                            color: 'var(--ds-color-foreground-secondary)',
                            background: 'var(--ds-color-background-inset)',
                            lineHeight: 1.6,
                            overflowX: 'auto',
                        }}
                    >
                        {code}
                    </pre>
                )}
            </div>
        </div>
    )
}

const TabButton = ({
    active,
    onClick,
    children,
}: {
    active: boolean
    onClick: () => void
    children: ReactNode
}) => (
    <button
        onClick={onClick}
        style={{
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 500,
            background: active
                ? 'var(--ds-surface-card-background)'
                : 'transparent',
            color: active
                ? 'var(--ds-color-foreground-primary)'
                : 'var(--ds-color-foreground-tertiary)',
            border: active ? 'var(--ds-surface-card-border)' : 'none',
            borderRadius: 'var(--ds-radius-sm)',
            boxShadow: active ? 'var(--ds-shadow-xs)' : 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
        }}
    >
        {children}
    </button>
)
