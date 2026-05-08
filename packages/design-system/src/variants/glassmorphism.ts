import type { VariantSpec } from './types.js'

export const glassmorphism: VariantSpec = {
    name: 'glassmorphism',
    label: 'Glassmorphism',
    description: '반투명 유리 느낌. 블러와 그라데이션 배경으로 세련된 macOS 풍.',
    preferredMode: 'dark',
    tokenOverrides: {
        radius: {
            none: '0px',
            xs: '6px',
            sm: '10px',
            md: '14px',
            lg: '18px',
            xl: '22px',
            '2xl': '28px',
            '3xl': '36px',
            full: '9999px',
        },
    },
    buildSurfaces: (mode, c) => {
        const isLight = mode === 'light'
        return {
            page: {
                background: isLight
                    ? `linear-gradient(135deg, ${c.primary100} 0%, ${c.neutral50} 50%, ${c.primary50} 100%)`
                    : `linear-gradient(135deg, ${c.primary900} 0%, #0a0a0c 50%, ${c.neutral900} 100%)`,
                backdropFilter: 'none',
                border: 'none',
                borderRadius: '0px',
                shadow: 'none',
                color: isLight ? c.neutral900 : c.neutral50,
            },
            panel: {
                background: isLight
                    ? 'rgba(255, 255, 255, 0.55)'
                    : 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(16px) saturate(160%)',
                border: `1px solid ${isLight ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.12)'}`,
                borderRadius: '18px',
                shadow: isLight
                    ? '0 8px 32px rgba(31, 38, 135, 0.1)'
                    : '0 8px 32px rgba(0, 0, 0, 0.4)',
                color: isLight ? c.neutral900 : c.neutral100,
            },
            card: {
                background: isLight
                    ? 'rgba(255, 255, 255, 0.45)'
                    : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: `1px solid ${isLight ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '18px',
                shadow: isLight
                    ? '0 8px 32px rgba(31, 38, 135, 0.12)'
                    : '0 8px 32px rgba(0, 0, 0, 0.5)',
                color: isLight ? c.neutral900 : c.neutral100,
            },
            overlay: {
                background: isLight
                    ? 'rgba(255, 255, 255, 0.7)'
                    : 'rgba(20, 20, 28, 0.7)',
                backdropFilter: 'blur(28px) saturate(180%)',
                border: `1px solid ${isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.15)'}`,
                borderRadius: '24px',
                shadow: '0 24px 64px rgba(0, 0, 0, 0.25)',
                color: isLight ? c.neutral900 : c.neutral100,
            },
            inset: {
                background: isLight
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${isLight ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.06)'}`,
                borderRadius: '14px',
                shadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
                color: isLight ? c.neutral800 : c.neutral200,
            },
        }
    },
    buildAccent: (mode, c) => {
        const isLight = mode === 'light'
        return {
            background: isLight
                ? `linear-gradient(135deg, ${c.primary500} 0%, ${c.primary600} 100%)`
                : `linear-gradient(135deg, ${c.primary400}cc 0%, ${c.primary600}cc 100%)`,
            color: '#ffffff',
            border: `1px solid ${isLight ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)'}`,
            shadow: isLight
                ? `0 6px 20px ${c.primary300}99`
                : `0 6px 20px ${c.primary700}99`,
            hoverBackground: isLight
                ? `linear-gradient(135deg, ${c.primary400} 0%, ${c.primary500} 100%)`
                : `linear-gradient(135deg, ${c.primary300}dd 0%, ${c.primary500}dd 100%)`,
            activeBackground: isLight
                ? `linear-gradient(135deg, ${c.primary600} 0%, ${c.primary700} 100%)`
                : `linear-gradient(135deg, ${c.primary500}dd 0%, ${c.primary700}dd 100%)`,
        }
    },
}
