import type { VariantSpec } from './types.js'

export const retro: VariantSpec = {
    name: 'retro',
    label: 'Retro / Y2K',
    description: '메탈릭과 크롬 느낌. 과감한 색상과 복고 요소를 모던 UI에 결합.',
    preferredMode: 'light',
    tokenOverrides: {
        radius: {
            none: '0px',
            xs: '4px',
            sm: '8px',
            md: '12px',
            lg: '16px',
            xl: '20px',
            '2xl': '28px',
            '3xl': '36px',
            full: '9999px',
        },
        typography: {
            fontFamily: {
                sans: '"Space Grotesk", "Inter", system-ui, sans-serif',
                serif: '"DM Serif Display", Georgia, serif',
                mono: '"JetBrains Mono", ui-monospace, monospace',
                display: '"Space Grotesk", "Inter", sans-serif',
            },
        },
    },
    buildSurfaces: (mode, c) => {
        const isLight = mode === 'light'
        return {
            page: {
                background: isLight
                    ? `radial-gradient(ellipse at top, ${c.primary100} 0%, ${c.neutral50} 50%)`
                    : `radial-gradient(ellipse at top, ${c.primary900} 0%, #0a0a14 50%)`,
                backdropFilter: 'none',
                border: 'none',
                borderRadius: '0px',
                shadow: 'none',
                color: isLight ? c.neutral900 : c.neutral50,
            },
            panel: {
                background: isLight
                    ? `linear-gradient(180deg, #ffffff 0%, ${c.primary50} 100%)`
                    : `linear-gradient(180deg, ${c.neutral800} 0%, ${c.neutral900} 100%)`,
                backdropFilter: 'none',
                border: `2px solid ${isLight ? c.primary300 : c.primary700}`,
                borderRadius: '12px',
                shadow: isLight
                    ? `0 4px 0 ${c.primary300}, 0 8px 16px rgba(0, 0, 0, 0.08)`
                    : `0 4px 0 ${c.primary800}, 0 8px 16px rgba(0, 0, 0, 0.5)`,
                color: isLight ? c.neutral900 : c.neutral100,
            },
            card: {
                background: isLight
                    ? `linear-gradient(145deg, #ffffff 0%, ${c.primary50} 50%, #ffffff 100%)`
                    : `linear-gradient(145deg, ${c.neutral800} 0%, ${c.primary900} 50%, ${c.neutral800} 100%)`,
                backdropFilter: 'none',
                border: `2px solid ${isLight ? c.primary400 : c.primary600}`,
                borderRadius: '16px',
                shadow: isLight
                    ? `0 6px 0 ${c.primary400}, 0 12px 24px ${c.primary200}`
                    : `0 6px 0 ${c.primary700}, 0 12px 24px rgba(0, 0, 0, 0.6)`,
                color: isLight ? c.neutral900 : c.neutral100,
            },
            overlay: {
                background: isLight
                    ? `linear-gradient(180deg, #ffffff 0%, ${c.primary100} 100%)`
                    : `linear-gradient(180deg, ${c.neutral800} 0%, ${c.primary900} 100%)`,
                backdropFilter: 'none',
                border: `3px solid ${isLight ? c.primary500 : c.primary500}`,
                borderRadius: '20px',
                shadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                color: isLight ? c.neutral900 : c.neutral100,
            },
            inset: {
                background: isLight
                    ? `linear-gradient(180deg, ${c.primary100} 0%, #ffffff 100%)`
                    : `linear-gradient(180deg, ${c.primary900} 0%, ${c.neutral800} 100%)`,
                backdropFilter: 'none',
                border: `2px solid ${isLight ? c.primary300 : c.primary700}`,
                borderRadius: '12px',
                shadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.08)',
                color: isLight ? c.neutral800 : c.neutral200,
            },
        }
    },
    buildAccent: (mode, c) => {
        const isLight = mode === 'light'
        return {
            background: isLight
                ? `linear-gradient(135deg, ${c.primary300} 0%, ${c.primary500} 50%, ${c.primary300} 100%)`
                : `linear-gradient(135deg, ${c.primary400} 0%, ${c.primary600} 50%, ${c.primary400} 100%)`,
            color: '#ffffff',
            border: `2px solid ${isLight ? c.primary600 : c.primary300}`,
            shadow: isLight
                ? `0 4px 0 ${c.primary600}, 0 6px 16px ${c.primary300}`
                : `0 4px 0 ${c.primary800}, 0 6px 16px ${c.primary700}`,
            hoverBackground: isLight
                ? `linear-gradient(135deg, ${c.primary200} 0%, ${c.primary400} 50%, ${c.primary200} 100%)`
                : `linear-gradient(135deg, ${c.primary300} 0%, ${c.primary500} 50%, ${c.primary300} 100%)`,
            activeBackground: isLight
                ? `linear-gradient(135deg, ${c.primary400} 0%, ${c.primary600} 50%, ${c.primary400} 100%)`
                : `linear-gradient(135deg, ${c.primary500} 0%, ${c.primary700} 50%, ${c.primary500} 100%)`,
        }
    },
}
