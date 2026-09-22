import type { BaseTokens } from '../tokens/types.js'

export type VariantName =
    | 'minimal'
    | 'neumorphism'
    | 'glassmorphism'
    | 'brutalism'
    | 'retro'

export type Mode = 'light' | 'dark'

export type SurfaceStyle = {
    background: string
    backdropFilter: string
    border: string
    borderRadius: string
    shadow: string
    color: string
}

export type SurfaceLevel = 'page' | 'panel' | 'card' | 'overlay' | 'inset'

export type AccentTreatment = {
    background: string
    color: string
    border: string
    shadow: string
    hoverBackground: string
    activeBackground: string
}

export type VariantSurfaces = Record<SurfaceLevel, SurfaceStyle>

export type VariantSpec = {
    name: VariantName
    label: string
    description: string
    preferredMode: Mode | 'any'
    tokenOverrides: DeepPartial<BaseTokens>
    buildSurfaces: (mode: Mode, ctx: VariantContext) => VariantSurfaces
    buildAccent: (mode: Mode, ctx: VariantContext) => AccentTreatment
}

export type VariantContext = {
    /**
     * 주어진 배경들 위에서 최악의 경우 대비가 가장 높은 글자색을 돌려준다.
     *
     * 배경 하나만 보면 안 된다. accent 는 기본/hover/active 에서 밝기가
     * 반대쪽으로 넘어가는 variant 가 있어서(뉴모피즘 라이트는 500 -> 600 으로
     * 어두워지고, 브루탈리즘은 400 -> 300 으로 밝아진다) 기본 배경 기준으로만
     * 고르면 hover 에서 대비가 무너진다.
     * 글자색을 상태마다 바꾸면 hover 때 글자가 깜빡이므로 하나로 고정하고,
     * 세 상태의 최저 대비가 가장 높은 쪽을 고른다.
     * 그라디언트처럼 단색이 아닌 값은 계산에서 제외한다.
     */
    readable: (...backgrounds: string[]) => string
    primary50: string
    primary100: string
    primary200: string
    primary300: string
    primary400: string
    primary500: string
    primary600: string
    primary700: string
    primary800: string
    primary900: string
    neutral50: string
    neutral100: string
    neutral200: string
    neutral300: string
    neutral400: string
    neutral500: string
    neutral600: string
    neutral700: string
    neutral800: string
    neutral900: string
}

export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
