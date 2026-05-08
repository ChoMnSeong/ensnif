import type { BaseTokens } from '../tokens/types.js'
import type {
    AccentTreatment,
    Mode,
    VariantName,
    VariantSurfaces,
} from '../variants/types.js'
import type {
    ColorScale,
    CustomPalette,
    Palette,
    PaletteName,
} from '../palettes/types.js'

export type SemanticColors = {
    background: {
        page: string
        panel: string
        card: string
        overlay: string
        inset: string
        muted: string
    }
    foreground: {
        primary: string
        secondary: string
        tertiary: string
        muted: string
        onAccent: string
    }
    border: {
        subtle: string
        default: string
        strong: string
    }
    accent: AccentTreatment
    state: {
        success: string
        warning: string
        danger: string
        info: string
        disabled: string
    }
    focusRing: string
}

export type ResolvedTheme = {
    paletteName: string
    variantName: VariantName
    mode: Mode
    palette: ResolvedPalette
    tokens: BaseTokens
    surfaces: VariantSurfaces
    semantic: SemanticColors
}

export type ResolvedPalette = {
    name: string
    label: string
    primary: ColorScale
    neutral: ColorScale
    success: ColorScale
    warning: ColorScale
    danger: ColorScale
    info: ColorScale
}

export type BuildThemeInput = {
    palette: PaletteName | Palette | CustomPalette
    variant: VariantName
    mode: Mode
    paletteOverrides?: PaletteOverrides
    tokenOverrides?: Partial<BaseTokens>
}

export type PaletteOverrides = {
    primary?: Partial<ColorScale>
    neutral?: Partial<ColorScale>
    success?: Partial<ColorScale>
    warning?: Partial<ColorScale>
    danger?: Partial<ColorScale>
    info?: Partial<ColorScale>
}
