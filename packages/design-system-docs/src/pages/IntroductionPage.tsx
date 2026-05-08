import {
    paletteNames,
    variantNames,
    useDesignSystem,
} from '@ensnif/design-system'
import { PageHeader } from '../components/PageHeader'

export const IntroductionPage = () => {
    const { theme } = useDesignSystem()
    return (
        <>
            <PageHeader
                eyebrow="Foundation"
                title="Introduction"
                description="Palette × Variant × Mode 세 축을 독립적으로 조합해 디자인 시스템을 구성합니다. 컴포넌트는 토큰만 참조하므로 모든 조합에 자동으로 반응합니다."
            />

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    marginBottom: '32px',
                }}
            >
                <Stat
                    label="Palettes"
                    value={String(paletteNames.length)}
                    detail="lavender, blue, green …"
                />
                <Stat
                    label="Variants"
                    value={String(variantNames.length)}
                    detail="minimal, glass, retro …"
                />
                <Stat
                    label="조합"
                    value={String(paletteNames.length * variantNames.length * 2)}
                    detail={`${paletteNames.length} × ${variantNames.length} × 2 (mode)`}
                />
            </div>

            <Block title="현재 적용된 테마">
                <pre
                    style={{
                        margin: 0,
                        padding: '14px 16px',
                        fontSize: '12px',
                        fontFamily:
                            '"JetBrains Mono", ui-monospace, monospace',
                        color: 'var(--ds-color-foreground-secondary)',
                        background: 'var(--ds-color-background-inset)',
                        border: '1px solid var(--ds-color-border-subtle)',
                        borderRadius: 'var(--ds-radius-md)',
                        lineHeight: 1.6,
                    }}
                >
                    {`{
  "palette":  "${theme.paletteName}",
  "variant":  "${theme.variantName}",
  "mode":     "${theme.mode}"
}`}
                </pre>
            </Block>

            <Block title="설치">
                <pre
                    style={codeBlockStyle}
                >{`pnpm add @ensnif/design-system`}</pre>
            </Block>

            <Block title="사용">
                <pre style={codeBlockStyle}>
                    {`import { DesignSystemProvider, themeTokens } from '@ensnif/design-system'

function App() {
    return (
        <DesignSystemProvider palette="${theme.paletteName}" variant="${theme.variantName}" mode="${theme.mode}">
            <YourApp />
        </DesignSystemProvider>
    )
}`}
                </pre>
            </Block>

            <p
                style={{
                    fontSize: '13px',
                    color: 'var(--ds-color-foreground-tertiary)',
                    marginTop: '32px',
                    lineHeight: 1.6,
                }}
            >
                우측 상단 <strong>Customize</strong> 버튼으로 팔레트·variant·mode를
                바꿔보세요. 이 페이지를 포함한 모든 영역이 즉시 반영됩니다.
            </p>
        </>
    )
}

const Stat = ({
    label,
    value,
    detail,
}: {
    label: string
    value: string
    detail: string
}) => (
    <div
        style={{
            background: 'var(--ds-color-background-card)',
            border: '1px solid var(--ds-color-border-subtle)',
            borderRadius: 'var(--ds-radius-lg)',
            padding: '16px 18px',
        }}
    >
        <div
            style={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--ds-color-foreground-tertiary)',
                marginBottom: '8px',
            }}
        >
            {label}
        </div>
        <div
            style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--ds-color-foreground-primary)',
                letterSpacing: '-0.02em',
                marginBottom: '4px',
            }}
        >
            {value}
        </div>
        <div
            style={{
                fontSize: '11px',
                color: 'var(--ds-color-foreground-tertiary)',
            }}
        >
            {detail}
        </div>
    </div>
)

const Block = ({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) => (
    <div style={{ marginBottom: '24px' }}>
        <h3
            style={{
                fontSize: '14px',
                fontWeight: 600,
                margin: '0 0 8px',
                color: 'var(--ds-color-foreground-primary)',
            }}
        >
            {title}
        </h3>
        {children}
    </div>
)

const codeBlockStyle: React.CSSProperties = {
    margin: 0,
    padding: '14px 16px',
    fontSize: '12px',
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    color: 'var(--ds-color-foreground-secondary)',
    background: 'var(--ds-color-background-inset)',
    border: '1px solid var(--ds-color-border-subtle)',
    borderRadius: 'var(--ds-radius-md)',
    lineHeight: 1.6,
    overflowX: 'auto',
}
