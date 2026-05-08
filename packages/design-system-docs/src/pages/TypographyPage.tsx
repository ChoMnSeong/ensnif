import { PageHeader } from '../components/PageHeader'

const sizes = [
    { name: '5xl', size: 'var(--ds-typography-fontSize-5xl)', text: 'Display' },
    { name: '4xl', size: 'var(--ds-typography-fontSize-4xl)', text: 'Heading 1' },
    { name: '3xl', size: 'var(--ds-typography-fontSize-3xl)', text: 'Heading 2' },
    { name: '2xl', size: 'var(--ds-typography-fontSize-2xl)', text: 'Heading 3' },
    { name: 'xl', size: 'var(--ds-typography-fontSize-xl)', text: 'Heading 4' },
    { name: 'lg', size: 'var(--ds-typography-fontSize-lg)', text: 'Subtitle' },
    { name: 'md', size: 'var(--ds-typography-fontSize-md)', text: 'Body text' },
    { name: 'sm', size: 'var(--ds-typography-fontSize-sm)', text: 'Caption' },
    { name: 'xs', size: 'var(--ds-typography-fontSize-xs)', text: 'Footnote' },
]

const weights = [
    { name: 'regular', value: 'var(--ds-typography-fontWeight-regular)' },
    { name: 'medium', value: 'var(--ds-typography-fontWeight-medium)' },
    { name: 'semibold', value: 'var(--ds-typography-fontWeight-semibold)' },
    { name: 'bold', value: 'var(--ds-typography-fontWeight-bold)' },
    { name: 'black', value: 'var(--ds-typography-fontWeight-black)' },
]

export const TypographyPage = () => (
    <>
        <PageHeader
            eyebrow="Foundation"
            title="Typography"
            description="font scale (xs–5xl) 9단계, weight 5단계. variant이 fontFamily를 덮어쓰는 경우도 있습니다 (예: retro)."
        />

        <h2 style={subTitle}>Sizes</h2>
        <div
            style={{
                background: 'var(--ds-color-background-card)',
                border: '1px solid var(--ds-color-border-subtle)',
                borderRadius: 'var(--ds-radius-lg)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                fontFamily: 'var(--ds-typography-fontFamily-sans)',
                marginBottom: '32px',
            }}
        >
            {sizes.map((s) => (
                <div
                    key={s.name}
                    style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '20px',
                    }}
                >
                    <div
                        style={{
                            width: '40px',
                            fontSize: '11px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            fontFamily: '"JetBrains Mono", monospace',
                            flexShrink: 0,
                        }}
                    >
                        {s.name}
                    </div>
                    <div
                        style={{
                            fontSize: s.size,
                            fontWeight: 600,
                            letterSpacing: '-0.01em',
                            color: 'var(--ds-color-foreground-primary)',
                        }}
                    >
                        {s.text}
                    </div>
                </div>
            ))}
        </div>

        <h2 style={subTitle}>Weights</h2>
        <div
            style={{
                background: 'var(--ds-color-background-card)',
                border: '1px solid var(--ds-color-border-subtle)',
                borderRadius: 'var(--ds-radius-lg)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            }}
        >
            {weights.map((w) => (
                <div
                    key={w.name}
                    style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '20px',
                    }}
                >
                    <div
                        style={{
                            width: '90px',
                            fontSize: '11px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            fontFamily: '"JetBrains Mono", monospace',
                            flexShrink: 0,
                        }}
                    >
                        {w.name}
                    </div>
                    <div
                        style={{
                            fontSize: '20px',
                            fontWeight: w.value,
                            color: 'var(--ds-color-foreground-primary)',
                            fontFamily: 'var(--ds-typography-fontFamily-sans)',
                        }}
                    >
                        Almost everything is interesting.
                    </div>
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
