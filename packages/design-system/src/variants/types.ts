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
