import { IconMoon, IconSun, useDesignSystem } from '@ensnif/design-system'

type Props = {
    onOpenSettings: () => void
}

export const TopNav = ({ onOpenSettings }: Props) => {
    const { theme, toggleMode } = useDesignSystem()
    return (
        <header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 24px',
                background: 'var(--ds-color-background-page)',
                borderBottom: '1px solid var(--ds-color-border-subtle)',
                backdropFilter: 'blur(8px)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                }}
            >
                <div
                    style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: 'var(--ds-color-accent-background)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--ds-color-accent-color)',
                        fontWeight: 800,
                        fontSize: '12px',
                    }}
                >
                    L
                </div>
                <span
                    style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--ds-color-foreground-primary)',
                    }}
                >
                    @ensnif/design-system
                </span>
                <span
                    style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        background: 'var(--ds-color-background-inset)',
                        color: 'var(--ds-color-foreground-tertiary)',
                        border: '1px solid var(--ds-color-border-subtle)',
                        borderRadius: '4px',
                        fontFamily: '"JetBrains Mono", monospace',
                    }}
                >
                    v0.1.0
                </span>
            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                <button
                    onClick={toggleMode}
                    aria-label="Toggle mode"
                    style={iconButtonStyle}
                    title={`현재: ${theme.mode}`}
                >
                    {theme.mode === 'light' ? (
                        <IconSun size={16} />
                    ) : (
                        <IconMoon size={16} />
                    )}
                </button>
                <button
                    onClick={onOpenSettings}
                    style={{
                        ...primaryButtonStyle,
                    }}
                >
                    Customize
                </button>
            </div>
        </header>
    )
}

const iconButtonStyle: React.CSSProperties = {
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    color: 'var(--ds-color-foreground-secondary)',
    border: '1px solid var(--ds-color-border-subtle)',
    borderRadius: 'var(--ds-radius-md)',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
}

const primaryButtonStyle: React.CSSProperties = {
    padding: '8px 14px',
    background: 'var(--ds-color-accent-background)',
    color: 'var(--ds-color-accent-color)',
    border: 'var(--ds-color-accent-border)',
    boxShadow: 'var(--ds-color-accent-shadow)',
    borderRadius: 'var(--ds-radius-md)',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
}
