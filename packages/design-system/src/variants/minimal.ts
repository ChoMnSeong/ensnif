import type { VariantSpec } from './types.js'

export const minimal: VariantSpec = {
    name: 'minimal',
    label: 'Minimal',
    description: '여백, 큰 타이포그래피, 단순한 구조 중심의 깔끔한 스타일.',
    preferredMode: 'light',
    // radius 는 base 가 이미 업계 관례(xs 4 / sm 6 / md 8 / lg 12)라 덮어쓰지 않는다.
    tokenOverrides: {
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
                shadow: 'var(--ds-shadow-xs)',
                color: isLight ? c.neutral900 : c.neutral100,
            },
            overlay: {
                background: isLight ? '#ffffff' : c.neutral900,
                backdropFilter: 'none',
                border: `1px solid ${isLight ? c.neutral200 : c.neutral700}`,
                borderRadius: '12px',
                shadow: 'var(--ds-shadow-lg)',
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
            background: c.primary600,
            color: c.readable(c.primary600, c.primary700, c.primary800),
            border: 'none',
            shadow: 'none',
            // 다크에서도 사다리를 어두운 쪽으로 둔다. 밝은 쪽으로 가면
            // 흰 글자 대비가 무너지고, 글자색을 상태마다 바꾸면 hover 때 깜빡인다.
            hoverBackground: c.primary700,
            activeBackground: c.primary800,
        }
    },
}
