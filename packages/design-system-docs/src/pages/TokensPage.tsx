import { PageHeader } from '../components/PageHeader'

const radii = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full']
const shadows = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'inner', 'glow']
const spacings = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20']

export const TokensPage = () => (
    <>
        <PageHeader
            eyebrow="Foundation"
            title="Tokens"
            description="Radius, shadow, spacing 스케일. Variant에 따라 일부가 덮어쓰여집니다."
        />

        <h2 style={subTitle}>Radius</h2>
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: '12px',
                marginBottom: '32px',
            }}
        >
            {radii.map((r) => (
                <div
                    key={r}
                    style={{
                        background: 'var(--ds-color-background-card)',
                        border: '1px solid var(--ds-color-border-subtle)',
                        borderRadius: 'var(--ds-radius-md)',
                        padding: '16px',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '54px',
                            background: 'var(--ds-color-accent-background)',
                            borderRadius: `var(--ds-radius-${r})`,
                            marginBottom: '10px',
                        }}
                    />
                    <div
                        style={{
                            fontSize: '11px',
                            fontFamily: '"JetBrains Mono", monospace',
                            color: 'var(--ds-color-foreground-secondary)',
                            fontWeight: 600,
                        }}
                    >
                        radius.{r}
                    </div>
                </div>
            ))}
        </div>

        <h2 style={subTitle}>Shadow</h2>
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '14px',
                padding: '20px',
                marginBottom: '32px',
                background: 'var(--ds-color-background-page)',
                border: '1px solid var(--ds-color-border-subtle)',
                borderRadius: 'var(--ds-radius-lg)',
            }}
        >
            {shadows.map((s) => (
                <div
                    key={s}
                    style={{
                        background: 'var(--ds-color-background-card)',
                        borderRadius: 'var(--ds-radius-md)',
                        padding: '20px 14px',
                        boxShadow: `var(--ds-shadow-${s})`,
                        fontSize: '11px',
                        fontFamily: '"JetBrains Mono", monospace',
                        color: 'var(--ds-color-foreground-secondary)',
                        textAlign: 'center',
                        fontWeight: 600,
                    }}
                >
                    shadow.{s}
                </div>
            ))}
        </div>

        <h2 style={subTitle}>Spacing</h2>
        <div
            style={{
                background: 'var(--ds-color-background-card)',
                border: '1px solid var(--ds-color-border-subtle)',
                borderRadius: 'var(--ds-radius-lg)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
            }}
        >
            {spacings.map((s) => (
                <div
                    key={s}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                    }}
                >
                    <span
                        style={{
                            fontSize: '11px',
                            fontFamily: '"JetBrains Mono", monospace',
                            width: '40px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            fontWeight: 600,
                        }}
                    >
                        {s}
                    </span>
                    <div
                        style={{
                            background: 'var(--ds-color-accent-background)',
                            height: '14px',
                            width: `var(--ds-spacing-${s})`,
                            borderRadius: '2px',
                            minWidth: '1px',
                        }}
                    />
                </div>
            ))}
        </div>
    </>
)

const subTitle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    margin: '0 0 12px',
    color: 'var(--ds-color-foreground-secondary)',
}
