import { useEffect } from 'react'
import {
    IconClose,
    IconMoon,
    IconSun,
    paletteNames,
    palettes,
    variantNames,
    variants,
    useDesignSystem,
    type BorderVariant,
    type Mode,
} from '@ensnif/design-system'

type Props = {
    open: boolean
    onClose: () => void
}

const BORDER_VARIANTS: BorderVariant[] = [
    'outlined',
    'underline',
    'filled',
    'ghost',
]

type FontPreset = {
    id: string
    label: string
    sans: string
    mono?: string
}

const FONT_PRESETS: FontPreset[] = [
    {
        id: 'system',
        label: 'System',
        sans: 'system-ui, -apple-system, sans-serif',
        mono: 'ui-monospace, monospace',
    },
    {
        id: 'inter',
        label: 'Inter',
        sans: '"Inter", system-ui, sans-serif',
        mono: '"JetBrains Mono", monospace',
    },
    {
        id: 'pretendard',
        label: 'Pretendard',
        sans: '"Pretendard", system-ui, sans-serif',
        mono: '"D2Coding", "JetBrains Mono", monospace',
    },
    {
        id: 'serif',
        label: 'Serif',
        sans: '"Source Serif Pro", "Noto Serif KR", Georgia, serif',
        mono: '"JetBrains Mono", monospace',
    },
    {
        id: 'mono',
        label: 'Mono',
        sans: '"JetBrains Mono", ui-monospace, monospace',
        mono: '"JetBrains Mono", monospace',
    },
]

export const ThemeDrawer = ({ open, onClose }: Props) => {
    const {
        theme,
        borderVariant,
        fonts,
        setPalette,
        setVariant,
        setMode,
        setBorderVariant,
        setFonts,
    } = useDesignSystem()

    const activeFontId =
        FONT_PRESETS.find((p) => p.sans === fonts?.sans)?.id ?? 'inter'

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (open) window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, onClose])

    return (
        <>
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.4)',
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? 'auto' : 'none',
                    transition: 'opacity 200ms ease',
                    zIndex: 50,
                }}
            />
            <aside
                aria-hidden={!open}
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    height: '100vh',
                    width: '380px',
                    maxWidth: '90vw',
                    background: 'var(--ds-color-background-page)',
                    borderLeft: '1px solid var(--ds-color-border-default)',
                    boxShadow: 'var(--ds-shadow-2xl)',
                    transform: open ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 240ms cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 60,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <header
                    style={{
                        padding: '20px 24px',
                        borderBottom: '1px solid var(--ds-color-border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontSize: '15px',
                                fontWeight: 700,
                                margin: '0 0 2px',
                            }}
                        >
                            Customize
                        </h2>
                        <p
                            style={{
                                fontSize: '11px',
                                margin: 0,
                                color: 'var(--ds-color-foreground-tertiary)',
                            }}
                        >
                            팔레트·variant·mode 조합
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            width: '28px',
                            height: '28px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--ds-color-foreground-tertiary)',
                            cursor: 'pointer',
                            borderRadius: 'var(--ds-radius-sm)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <IconClose size={16} />
                    </button>
                </header>

                <div
                    data-ds-scrollbar=""
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '20px 24px',
                    }}
                >
                    <Group title="Mode">
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {(['light', 'dark'] as Mode[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    style={{
                                        ...chipStyle(theme.mode === m),
                                        gap: '6px',
                                    }}
                                >
                                    {m === 'light' ? (
                                        <IconSun size={14} />
                                    ) : (
                                        <IconMoon size={14} />
                                    )}
                                    <span>
                                        {m === 'light' ? 'Light' : 'Dark'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </Group>

                    <Group title="Palette">
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '6px',
                            }}
                        >
                            {paletteNames.map((name) => {
                                const p = palettes[name]
                                const isActive = theme.paletteName === name
                                return (
                                    <button
                                        key={name}
                                        onClick={() => setPalette(name)}
                                        style={{
                                            ...chipStyle(isActive),
                                            justifyContent: 'flex-start',
                                            gap: '8px',
                                            padding: '8px 10px',
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: '14px',
                                                height: '14px',
                                                borderRadius: '4px',
                                                background: p.primary[500],
                                                border:
                                                    '1px solid var(--ds-color-border-subtle)',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <span style={{ fontSize: '12px' }}>
                                            {p.label}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </Group>

                    <Group title="Font">
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '6px',
                            }}
                        >
                            {FONT_PRESETS.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() =>
                                        setFonts({
                                            sans: p.sans,
                                            mono: p.mono,
                                        })
                                    }
                                    style={{
                                        ...chipStyle(activeFontId === p.id),
                                        fontFamily: p.sans,
                                    }}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </Group>

                    <Group title="Border style (default for all containers)">
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '6px',
                            }}
                        >
                            {BORDER_VARIANTS.map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setBorderVariant(v)}
                                    style={chipStyle(borderVariant === v)}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </Group>

                    <Group title="Variant">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                            }}
                        >
                            {variantNames.map((name) => {
                                const v = variants[name]
                                const isActive = theme.variantName === name
                                return (
                                    <button
                                        key={name}
                                        onClick={() => setVariant(name)}
                                        style={{
                                            ...chipStyle(isActive),
                                            justifyContent: 'flex-start',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            padding: '10px 12px',
                                            gap: '2px',
                                        }}
                                        title={v.description}
                                    >
                                        <span
                                            style={{
                                                fontSize: '12px',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {v.label}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: '10px',
                                                color: isActive
                                                    ? 'var(--ds-color-accent-color)'
                                                    : 'var(--ds-color-foreground-tertiary)',
                                                opacity: isActive ? 0.8 : 1,
                                                lineHeight: 1.3,
                                                textAlign: 'left',
                                            }}
                                        >
                                            {v.description}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </Group>
                </div>

                <footer
                    style={{
                        padding: '14px 24px',
                        borderTop: '1px solid var(--ds-color-border-subtle)',
                        fontSize: '11px',
                        color: 'var(--ds-color-foreground-tertiary)',
                        fontFamily: '"JetBrains Mono", monospace',
                    }}
                >
                    {theme.paletteName} · {theme.variantName} · {theme.mode} · {borderVariant}
                </footer>
            </aside>
        </>
    )
}

const Group = ({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) => (
    <div style={{ marginBottom: '20px' }}>
        <div
            style={{
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--ds-color-foreground-tertiary)',
                marginBottom: '8px',
            }}
        >
            {title}
        </div>
        {children}
    </div>
)

const chipStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: '8px 12px',
    background: active
        ? 'var(--ds-color-accent-background)'
        : 'var(--ds-color-background-inset)',
    color: active
        ? 'var(--ds-color-accent-color)'
        : 'var(--ds-color-foreground-secondary)',
    border: active
        ? 'var(--ds-color-accent-border)'
        : '1px solid var(--ds-color-border-subtle)',
    borderRadius: 'var(--ds-radius-md)',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'center',
    transition: 'all 100ms ease',
})
