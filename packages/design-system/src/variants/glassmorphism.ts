import type { VariantSpec } from './types.js'

export const glassmorphism: VariantSpec = {
    name: 'glassmorphism',
    label: 'Glassmorphism',
    description:
        '반투명 유리 느낌. 블러와 그라데이션 배경으로 세련된 macOS 풍.',
    preferredMode: 'dark',
    tokenOverrides: {
        // 유리 표면 위 글자라 기하학적이고 가벼운 산세리프가 맞는다.
        // taste-skill 4.1 이 Inter 대안으로 지목한 Outfit.
        typography: {
            fontFamily: {
                sans: '"Outfit", "Pretendard", system-ui, sans-serif',
                serif: '"Source Serif 4", Georgia, serif',
                mono: '"JetBrains Mono", ui-monospace, monospace',
                display: '"Outfit", "Pretendard", system-ui, sans-serif',
            },
        },
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
                // 선형 135도 페이드는 방향성 이음매가 생겨 콘텐츠를 가로지른다.
                // 겹친 radial(메시)은 축이 없어 자연스럽게 번지고, 유리의 블러가
                // 굴절시킬 색 덩어리도 만들어 준다.
                background: isLight
                    ? [
                          `radial-gradient(1100px 620px at 8% -10%, ${c.primary100} 0%, transparent 62%)`,
                          `radial-gradient(900px 520px at 92% 8%, ${c.primary50} 0%, transparent 58%)`,
                          c.neutral50,
                      ].join(', ')
                    : [
                          `radial-gradient(1100px 620px at 8% -10%, ${c.primary900} 0%, transparent 62%)`,
                          `radial-gradient(900px 520px at 92% 8%, ${c.neutral800} 0%, transparent 58%)`,
                          '#0a0a0c',
                      ].join(', '),
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
                shadow: `0 8px 32px var(--ds-color-shadow-key)`,
                color: isLight ? c.neutral900 : c.neutral100,
            },
            card: {
                background: isLight
                    ? 'rgba(255, 255, 255, 0.45)'
                    : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: `1px solid ${isLight ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '18px',
                shadow: `0 12px 32px var(--ds-color-shadow-key)`,
                color: isLight ? c.neutral900 : c.neutral100,
            },
            overlay: {
                background: isLight
                    ? 'rgba(255, 255, 255, 0.7)'
                    : 'rgba(20, 20, 28, 0.7)',
                backdropFilter: 'blur(28px) saturate(180%)',
                border: `1px solid ${isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.15)'}`,
                borderRadius: '24px',
                shadow: `0 24px 64px var(--ds-color-shadow-strong)`,
                color: isLight ? c.neutral900 : c.neutral100,
            },
            inset: {
                background: isLight
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${isLight ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.06)'}`,
                borderRadius: '14px',
                shadow: `inset 0 1px 2px var(--ds-color-shadow-ambient)`,
                color: isLight ? c.neutral800 : c.neutral200,
            },
        }
    },
    buildAccent: (mode, c) => {
        const isLight = mode === 'light'
        return {
            // 그라디언트 폭이 넓으면 흰 글자도 어두운 글자도 한쪽 끝에서 무너진다.
            // 다른 variant 와 같은 600/700/800 계열로 좁혀 흰 글자를 성립시킨다.
            background: isLight
                ? `linear-gradient(135deg, ${c.primary600} 0%, ${c.primary700} 100%)`
                : `linear-gradient(135deg, ${c.primary600}e6 0%, ${c.primary800}e6 100%)`,
            // 그라디언트는 대비 계산이 안 되니 가장 밝은 지점(글자에 가장 불리한 곳)으로 판단한다.
            color: c.readable(c.primary600, c.primary700, c.primary800),
            border: `1px solid ${isLight ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)'}`,
            shadow: isLight
                ? `0 6px 20px ${c.primary300}99`
                : `0 6px 20px ${c.primary700}99`,
            hoverBackground: isLight
                ? `linear-gradient(135deg, ${c.primary700} 0%, ${c.primary800} 100%)`
                : `linear-gradient(135deg, ${c.primary700}f2 0%, ${c.primary800}f2 100%)`,
            activeBackground: isLight
                ? `linear-gradient(135deg, ${c.primary800} 0%, ${c.primary900} 100%)`
                : `linear-gradient(135deg, ${c.primary800} 0%, ${c.primary900} 100%)`,
        }
    },
}
