type Props = {
    title: string
    description?: string
}

/**
 * 크기·굵기·행간·자간을 직접 박지 않고 타입 역할 토큰을 쓴다.
 * 직접 박으면 variant 나 fonts prop 으로 타이포를 바꿔도 제목이 반응하지 않는다.
 */
export const PageHeader = ({ title, description }: Props) => (
    <header style={{ marginBottom: '32px' }}>
        <h1
            style={{
                fontSize: 'var(--ds-typography-role-display-sm-font-size)',
                fontWeight: 'var(--ds-typography-role-display-sm-font-weight)',
                lineHeight: 'var(--ds-typography-role-display-sm-line-height)',
                letterSpacing:
                    'var(--ds-typography-role-display-sm-letter-spacing)',
                fontFamily: 'var(--ds-typography-font-family-display)',
                margin: '0 0 8px',
                color: 'var(--ds-color-foreground-primary)',
            }}
        >
            {title}
        </h1>
        {description && (
            <p
                style={{
                    fontSize: 'var(--ds-typography-role-body-sm-font-size)',
                    lineHeight:
                        'var(--ds-typography-role-body-sm-line-height)',
                    color: 'var(--ds-color-foreground-secondary)',
                    margin: 0,
                    maxWidth: '68ch',
                }}
            >
                {description}
            </p>
        )}
    </header>
)
