import type { VariantSpec } from './types.js'

export const brutalism: VariantSpec = {
    name: 'brutalism',
    label: 'Brutalism',
    description: '의도적으로 투박하게. 두꺼운 검정 보더, 0 라운드, 오프셋 그림자.',
    preferredMode: 'light',
    tokenOverrides: {
        radius: {
            none: '0px',
            xs: '0px',
            sm: '0px',
            md: '0px',
            lg: '0px',
            xl: '0px',
            '2xl': '0px',
            '3xl': '0px',
            full: '0px',
        },
        borderWidth: {
            none: '0px',
            thin: '2px',
            default: '3px',
            thick: '4px',
            heavy: '6px',
        },
    },
    buildSurfaces: (mode, c) => {
        const isLight = mode === 'light'
        const ink = isLight ? '#000000' : '#ffffff'
        const paper = isLight ? '#ffffff' : '#000000'
        return {
            page: {
                background: isLight ? c.neutral50 : '#0a0a0a',
                backdropFilter: 'none',
                border: 'none',
                borderRadius: '0px',
                shadow: 'none',
                color: ink,
            },
            panel: {
                background: paper,
                backdropFilter: 'none',
                border: `3px solid ${ink}`,
                borderRadius: '0px',
                shadow: `6px 6px 0 ${ink}`,
                color: ink,
            },
            card: {
                background: paper,
                backdropFilter: 'none',
                border: `3px solid ${ink}`,
                borderRadius: '0px',
                shadow: `8px 8px 0 ${ink}`,
                color: ink,
            },
            overlay: {
                background: paper,
                backdropFilter: 'none',
                border: `4px solid ${ink}`,
                borderRadius: '0px',
                shadow: `12px 12px 0 ${ink}`,
                color: ink,
            },
            inset: {
                background: isLight ? c.neutral100 : c.neutral800,
                backdropFilter: 'none',
                border: `2px solid ${ink}`,
                borderRadius: '0px',
                shadow: 'none',
                color: ink,
            },
        }
    },
    buildAccent: (mode, c) => {
        const isLight = mode === 'light'
        const ink = isLight ? '#000000' : '#ffffff'
        return {
            background: isLight ? c.primary400 : c.primary500,
            color: ink,
            border: `3px solid ${ink}`,
            shadow: `5px 5px 0 ${ink}`,
            hoverBackground: isLight ? c.primary300 : c.primary400,
            activeBackground: isLight ? c.primary500 : c.primary600,
        }
    },
}
