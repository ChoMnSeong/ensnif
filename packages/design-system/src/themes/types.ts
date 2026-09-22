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
        /** 모달/드로어 뒤에 까는 암막. 팔레트 중립색에서 파생된다. */
        scrim: string
    }
    foreground: {
        primary: string
        secondary: string
        tertiary: string
        muted: string
        onAccent: string
        /**
         * 각 배경색 위에 얹을 글자색. 흰색과 중립 900 중 대비가 높은 쪽을 고른다.
         * 모드에 따라 state 스텝이 600/400 으로 뒤집히므로 고정값으로는 WCAG AA 를 못 맞춘다.
         */
        onPrimary: string
        onSuccess: string
        onWarning: string
        onDanger: string
        onInfo: string
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
    /** 팔레트 중립색에서 파생된 그림자 색. shadow 토큰이 이 값을 참조한다. */
    shadow: {
        ambient: string
        key: string
        strong: string
        glow: string
    }
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
