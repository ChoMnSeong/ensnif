import type { VariantSpec } from './types.js'

export const neumorphism: VariantSpec = {
    name: 'neumorphism',
    label: 'Neumorphism',
    description: '배경과 비슷한 색에 안/바깥 그림자로 부드럽게 입체감 표현.',
    preferredMode: 'light',
    tokenOverrides: {
        radius: {
            none: '0px',
            xs: '8px',
            sm: '12px',
            md: '16px',
            lg: '20px',
            xl: '28px',
            '2xl': '36px',
            '3xl': '48px',
            full: '9999px',
        },
    },
    buildSurfaces: (mode, c) => {
        const isLight = mode === 'light'
        const base = isLight ? '#e8eaee' : '#1f2227'
        const lightShadow = isLight
            ? 'rgba(255, 255, 255, 0.55)'
            : 'rgba(255, 255, 255, 0.04)'
        const darkShadow = isLight
            ? 'rgba(174, 174, 192, 0.4)'
            : 'rgba(0, 0, 0, 0.6)'
        return {
            page: {
                background: base,
                backdropFilter: 'none',
                border: 'none',
                borderRadius: '0px',
                shadow: 'none',
                color: isLight ? c.neutral900 : c.neutral100,
            },
            panel: {
                background: base,
                backdropFilter: 'none',
                border: 'none',
                borderRadius: '20px',
                shadow: `8px 8px 16px ${darkShadow}, -8px -8px 16px ${lightShadow}`,
                color: isLight ? c.neutral900 : c.neutral100,
            },
            card: {
                background: base,
                backdropFilter: 'none',
                border: 'none',
                borderRadius: '20px',
                shadow: `10px 10px 20px ${darkShadow}, -10px -10px 20px ${lightShadow}`,
                color: isLight ? c.neutral900 : c.neutral100,
            },
            overlay: {
                background: base,
                backdropFilter: 'none',
                border: 'none',
                borderRadius: '24px',
                shadow: isLight
                    ? '0 24px 48px rgba(40, 50, 70, 0.2), 0 8px 16px rgba(40, 50, 70, 0.12)'
                    : '0 24px 48px rgba(0, 0, 0, 0.55), 0 8px 16px rgba(0, 0, 0, 0.4)',
                color: isLight ? c.neutral900 : c.neutral100,
            },
            inset: {
                background: base,
                backdropFilter: 'none',
                border: 'none',
                borderRadius: '16px',
                shadow: `inset 5px 5px 10px ${darkShadow}, inset -5px -5px 10px ${lightShadow}`,
                color: isLight ? c.neutral800 : c.neutral200,
            },
        }
    },
    buildAccent: (mode, c) => {
        const isLight = mode === 'light'
        const lightShadow = isLight
            ? 'rgba(255, 255, 255, 0.7)'
            : 'rgba(255, 255, 255, 0.05)'
        const darkShadow = isLight
            ? `${c.primary800}40`
            : 'rgba(0, 0, 0, 0.7)'
        const bg = isLight ? c.primary500 : c.primary600
        return {
            background: bg,
            color: '#ffffff',
            border: 'none',
            shadow: `6px 6px 12px ${darkShadow}, -6px -6px 12px ${lightShadow}`,
            hoverBackground: isLight ? c.primary600 : c.primary500,
            activeBackground: bg,
        }
    },
}
