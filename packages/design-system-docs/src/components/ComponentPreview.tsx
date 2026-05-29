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
                    border: '1px solid var(--ds-color-border-subtle)',
                    borderRadius: 'var(--ds-radius-lg)',
                    overflow: 'hidden',
                    background: 'var(--ds-color-background-card)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px 6px 16px',
                        borderBottom:
                            '1px solid var(--ds-color-border-subtle)',
                        background: 'var(--ds-color-background-inset)',
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
                                    'var(--ds-color-background-card)',
                                color: 'var(--ds-color-foreground-secondary)',
                                border: '1px solid var(--ds-color-border-subtle)',
                                borderRadius: 'var(--ds-radius-sm)',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                            }}
                        >
                            {copied ? 'Copied!' : 'Copy'}
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
                            justifyContent: 'center',
                            minHeight: '160px',
                            background: 'var(--ds-color-background-page)',
                            backgroundImage:
                                'radial-gradient(circle, var(--ds-color-border-subtle) 1px, transparent 1px)',
                            backgroundSize: '14px 14px',
                            backgroundPosition: '0 0',
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
                                '"JetBrains Mono", ui-monospace, monospace',
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
                ? 'var(--ds-color-background-card)'
                : 'transparent',
            color: active
                ? 'var(--ds-color-foreground-primary)'
                : 'var(--ds-color-foreground-tertiary)',
            border: 'none',
            borderRadius: 'var(--ds-radius-sm)',
            cursor: 'pointer',
            fontFamily: 'inherit',
        }}
    >
        {children}
    </button>
)
