import type { VariantSpec } from './types.js'

export const minimal: VariantSpec = {
    name: 'minimal',
    label: 'Minimal',
    description: '여백, 큰 타이포그래피, 단순한 구조 중심의 깔끔한 스타일.',
    preferredMode: 'light',
    tokenOverrides: {
        radius: {
            none: '0px',
            xs: '2px',
            sm: '4px',
            md: '6px',
            lg: '8px',
            xl: '12px',
            '2xl': '16px',
            '3xl': '20px',
            full: '9999px',
        },
        borderWidth: {
            none: '0px',
            thin: '1px',
            default: '1px',
            thick: '1px',
            heavy: '2px',
        },
    },
    buildSurfaces: (mode, c) => {
        const isLight = mode === 'light'
        return {
            page: {
                background: isLight ? c.neutral50 : c.neutral900,
                backdropFilter: 'none',
                border: 'none',
                borderRadius: '0px',
                shadow: 'none',
                color: isLight ? c.neutral900 : c.neutral50,
            },
            panel: {
                background: isLight ? '#ffffff' : c.neutral800,
                backdropFilter: 'none',
                border: `1px solid ${isLight ? c.neutral200 : c.neutral700}`,
                borderRadius: '8px',
                shadow: 'none',
                color: isLight ? c.neutral900 : c.neutral100,
            },
            card: {
                background: isLight ? '#ffffff' : c.neutral800,
                backdropFilter: 'none',
                border: `1px solid ${isLight ? c.neutral200 : c.neutral700}`,
                borderRadius: '8px',
                shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
                color: isLight ? c.neutral900 : c.neutral100,
            },
            overlay: {
                background: isLight ? '#ffffff' : c.neutral900,
                backdropFilter: 'none',
                border: `1px solid ${isLight ? c.neutral200 : c.neutral700}`,
                borderRadius: '12px',
                shadow:
                    '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
                color: isLight ? c.neutral900 : c.neutral100,
            },
            inset: {
                background: isLight ? c.neutral100 : c.neutral800,
                backdropFilter: 'none',
                border: `1px solid ${isLight ? c.neutral200 : c.neutral700}`,
                borderRadius: '6px',
                shadow: 'none',
                color: isLight ? c.neutral800 : c.neutral200,
            },
        }
    },
    buildAccent: (mode, c) => {
        const isLight = mode === 'light'
        return {
            background: isLight ? c.primary600 : c.primary500,
            color: '#ffffff',
            border: 'none',
            shadow: 'none',
            hoverBackground: isLight ? c.primary700 : c.primary400,
            activeBackground: isLight ? c.primary800 : c.primary300,
        }
    },
}
