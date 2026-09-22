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
        // taste-skill 은 브루탈리즘을 "native CSS, monospace, raw borders" 로 규정한다.
        // 타이포를 재정의하지 않으면 두꺼운 테두리만 얹힌 평범한 페이지로 읽힌다.
        typography: {
            fontFamily: {
                sans: '"JetBrains Mono", ui-monospace, monospace',
                serif: '"JetBrains Mono", ui-monospace, monospace',
                mono: '"JetBrains Mono", ui-monospace, monospace',
                display: '"JetBrains Mono", ui-monospace, monospace',
            },
            letterSpacing: {
                tighter: '-0.02em',
                tight: '-0.01em',
                normal: '0em',
                wide: '0.08em',
            },
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
            background: c.primary600,
            color: c.readable(c.primary600, c.primary700, c.primary800),
            border: `3px solid ${ink}`,
            shadow: `5px 5px 0 ${ink}`,
            hoverBackground: c.primary700,
            activeBackground: c.primary800,
        }
    },
}
