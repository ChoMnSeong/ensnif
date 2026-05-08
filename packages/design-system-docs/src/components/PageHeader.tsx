type Props = {
    title: string
    description?: string
    eyebrow?: string
}

export const PageHeader = ({ title, description, eyebrow }: Props) => (
    <header style={{ marginBottom: '32px' }}>
        {eyebrow && (
            <div
                style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--ds-color-foreground-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '6px',
                }}
            >
                {eyebrow}
            </div>
        )}
        <h1
            style={{
                fontSize: '32px',
                fontWeight: 700,
                margin: '0 0 8px',
                letterSpacing: '-0.02em',
                color: 'var(--ds-color-foreground-primary)',
            }}
        >
            {title}
        </h1>
        {description && (
            <p
                style={{
                    fontSize: '14px',
                    color: 'var(--ds-color-foreground-secondary)',
                    margin: 0,
                    maxWidth: '720px',
                    lineHeight: 1.6,
                }}
            >
                {description}
            </p>
        )}
    </header>
)
