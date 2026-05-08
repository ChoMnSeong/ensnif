import { useTheme } from '@ensnif/design-system'
import { PageHeader } from '../components/PageHeader'

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const

export const PalettesPage = () => {
    const theme = useTheme()
    const groups = [
        { name: 'Primary', scale: theme.palette.primary, key: 'primary' },
        { name: 'Neutral', scale: theme.palette.neutral, key: 'neutral' },
        { name: 'Success', scale: theme.palette.success, key: 'success' },
        { name: 'Warning', scale: theme.palette.warning, key: 'warning' },
        { name: 'Danger', scale: theme.palette.danger, key: 'danger' },
        { name: 'Info', scale: theme.palette.info, key: 'info' },
    ]
    return (
        <>
            <PageHeader
                eyebrow="Foundation"
                title="Palettes"
                description="50–900 step 컬러 스케일. primary는 선택된 팔레트, neutral은 primary 톤에 어울리는 회색조, semantic은 success/warning/danger/info 공통."
            />

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                }}
            >
                {groups.map((g) => (
                    <div key={g.key}>
                        <div
                            style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                color: 'var(--ds-color-foreground-tertiary)',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                            }}
                        >
                            {g.name}
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(10, 1fr)',
                                gap: '4px',
                            }}
                        >
                            {STEPS.map((step) => (
                                <div
                                    key={step}
                                    style={{
                                        background: g.scale[step],
                                        height: '64px',
                                        borderRadius: 'var(--ds-radius-md)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        padding: '6px 8px',
                                        fontSize: '10px',
                                        fontFamily:
                                            '"JetBrains Mono", monospace',
                                        color:
                                            step >= 500
                                                ? 'rgba(255,255,255,0.92)'
                                                : 'rgba(0,0,0,0.72)',
                                        border: '1px solid var(--ds-color-border-subtle)',
                                    }}
                                >
                                    <span style={{ fontWeight: 700 }}>
                                        {step}
                                    </span>
                                    <span style={{ opacity: 0.85 }}>
                                        {g.scale[step]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
