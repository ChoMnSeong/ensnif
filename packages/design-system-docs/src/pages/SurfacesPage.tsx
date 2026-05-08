import { PageHeader } from '../components/PageHeader'

const LEVELS = ['page', 'panel', 'card', 'overlay', 'inset'] as const

export const SurfacesPage = () => (
    <>
        <PageHeader
            eyebrow="Foundation"
            title="Surfaces"
            description="Variant이 정의하는 5단계 표면 스타일. 각 surface는 background / border / borderRadius / boxShadow / backdropFilter / color 토큰을 가집니다."
        />

        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
            }}
        >
            {LEVELS.map((level) => (
                <div
                    key={level}
                    style={{
                        background: `var(--ds-surface-${level}-background)`,
                        backdropFilter: `var(--ds-surface-${level}-backdrop-filter)`,
                        border: `var(--ds-surface-${level}-border)`,
                        borderRadius: `var(--ds-surface-${level}-radius)`,
                        boxShadow: `var(--ds-surface-${level}-shadow)`,
                        color: `var(--ds-surface-${level}-color)`,
                        padding: '24px 20px',
                        minHeight: '140px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            opacity: 0.7,
                            marginBottom: '10px',
                        }}
                    >
                        surface.{level}
                    </div>
                    <div
                        style={{
                            fontSize: '15px',
                            fontWeight: 600,
                            marginBottom: '6px',
                        }}
                    >
                        샘플 컨테이너
                    </div>
                    <div
                        style={{
                            fontSize: '12px',
                            opacity: 0.75,
                            lineHeight: 1.5,
                        }}
                    >
                        이 박스는 surface.{level} 토큰만 사용합니다. variant·mode
                        변경 시 즉시 반영.
                    </div>
                </div>
            ))}
        </div>

        <div
            style={{
                marginTop: '32px',
                padding: '14px 16px',
                background: 'var(--ds-color-background-inset)',
                border: '1px solid var(--ds-color-border-subtle)',
                borderRadius: 'var(--ds-radius-md)',
                fontSize: '12px',
                fontFamily: '"JetBrains Mono", monospace',
                color: 'var(--ds-color-foreground-secondary)',
                lineHeight: 1.7,
            }}
        >
            background: <span style={{ color: 'var(--ds-color-accent-background)' }}>var(--ds-surface-card-background)</span>
            <br />
            border:{' '}
            <span style={{ color: 'var(--ds-color-accent-background)' }}>
                var(--ds-surface-card-border)
            </span>
            <br />
            border-radius:{' '}
            <span style={{ color: 'var(--ds-color-accent-background)' }}>
                var(--ds-surface-card-radius)
            </span>
            <br />
            box-shadow:{' '}
            <span style={{ color: 'var(--ds-color-accent-background)' }}>
                var(--ds-surface-card-shadow)
            </span>
        </div>
    </>
)
