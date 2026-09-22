import { baseTokens } from '../tokens/base.js'
import type { BaseTokens } from '../tokens/types.js'
import { variants } from '../variants/index.js'
import type { VariantContext } from '../variants/types.js'
import { palettes } from '../palettes/index.js'
import {
    successScale,
    warningScale,
    dangerScale,
    infoScale,
} from '../palettes/semantic.js'
import { zincNeutral } from '../palettes/neutral.js'
import type {
    ColorScale,
    CustomPalette,
    Palette,
    PaletteName,
} from '../palettes/types.js'
import { deepMerge } from '../utils/deepMerge.js'
import type {
    BuildThemeInput,
    PaletteOverrides,
    ResolvedPalette,
    ResolvedTheme,
    SemanticColors,
} from './types.js'

const isPaletteName = (
    value: PaletteName | Palette | CustomPalette,
): value is PaletteName => {
    return typeof value === 'string'
}

const hexWithAlpha = (hex: string, alpha: number): string => {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex
    const clamped = Math.max(0, Math.min(1, alpha))
    const a = Math.round(clamped * 255)
        .toString(16)
        .padStart(2, '0')
    return `${hex}${a}`
}

const relativeLuminance = (hex: string): number => {
    const c = hex.replace('#', '')
    const channels = [0, 2, 4].map((i) => {
        const v = parseInt(c.slice(i, i + 2), 16) / 255
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

const contrastRatio = (a: string, b: string): number => {
    const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort(
        (x, y) => y - x,
    )
    return (hi + 0.05) / (lo + 0.05)
}

/** 배경 위에서 대비가 더 높은 글자색을 고른다. 흰색 고정은 양쪽 모드를 동시에 만족시키지 못한다. */
const readableOn = (background: string, dark: string): string => {
    if (!/^#[0-9a-fA-F]{6}$/.test(background)) return '#ffffff'
    return contrastRatio('#ffffff', background) >=
        contrastRatio(dark, background)
        ? '#ffffff'
        : dark
}

/** 여러 배경 위에서 최저 대비가 가장 높은 글자색. 상태가 바뀌어도 대비가 무너지지 않게 한다. */
const readableAcross = (backgrounds: string[], dark: string): string => {
    const solids = backgrounds.filter((b) => /^#[0-9a-fA-F]{6}$/.test(b))
    if (solids.length === 0) return '#ffffff'
    const worst = (fg: string) =>
        Math.min(...solids.map((bg) => contrastRatio(fg, bg)))
    return worst('#ffffff') >= worst(dark) ? '#ffffff' : dark
}

const mergeScale = (
    base: ColorScale,
    override?: Partial<ColorScale>,
): ColorScale => {
    if (!override) return base
    return { ...base, ...override }
}

const resolvePalette = (
    input: PaletteName | Palette | CustomPalette,
    overrides?: PaletteOverrides,
): ResolvedPalette => {
    let base: {
        name: string
        label: string
        primary: ColorScale
        neutral: ColorScale
    }
    if (isPaletteName(input)) {
        const preset = palettes[input]
        base = {
            name: preset.name,
            label: preset.label,
            primary: preset.primary,
            neutral: preset.neutral,
        }
    } else {
        base = {
            name: input.name,
            label: 'label' in input && input.label ? input.label : input.name,
            primary: input.primary,
            neutral:
                'neutral' in input && input.neutral
                    ? input.neutral
                    : zincNeutral,
        }
    }
    return {
        name: base.name,
        label: base.label,
        primary: mergeScale(base.primary, overrides?.primary),
        neutral: mergeScale(base.neutral, overrides?.neutral),
        success: mergeScale(successScale, overrides?.success),
        warning: mergeScale(warningScale, overrides?.warning),
        danger: mergeScale(dangerScale, overrides?.danger),
        info: mergeScale(infoScale, overrides?.info),
    }
}

const buildContext = (palette: ResolvedPalette): VariantContext => ({
    readable: (...backgrounds: string[]) =>
        readableAcross(backgrounds, palette.neutral[900]),
    primary50: palette.primary[50],
    primary100: palette.primary[100],
    primary200: palette.primary[200],
    primary300: palette.primary[300],
    primary400: palette.primary[400],
    primary500: palette.primary[500],
    primary600: palette.primary[600],
    primary700: palette.primary[700],
    primary800: palette.primary[800],
    primary900: palette.primary[900],
    neutral50: palette.neutral[50],
    neutral100: palette.neutral[100],
    neutral200: palette.neutral[200],
    neutral300: palette.neutral[300],
    neutral400: palette.neutral[400],
    neutral500: palette.neutral[500],
    neutral600: palette.neutral[600],
    neutral700: palette.neutral[700],
    neutral800: palette.neutral[800],
    neutral900: palette.neutral[900],
})

export const buildTheme = (input: BuildThemeInput): ResolvedTheme => {
    const { palette: paletteInput, variant: variantName, mode } = input
    const variantSpec = variants[variantName]
    if (!variantSpec) {
        throw new Error(`Unknown variant: ${variantName}`)
    }

    const palette = resolvePalette(paletteInput, input.paletteOverrides)
    const ctx = buildContext(palette)

    const tokens = deepMerge(
        deepMerge(
            baseTokens as unknown as Record<string, unknown>,
            {
                ...(variantSpec.tokenOverrides as Partial<BaseTokens>),
            } as Record<string, unknown>,
        ),
        (input.tokenOverrides ?? {}) as Record<string, unknown>,
    ) as unknown as BaseTokens

    const surfaces = variantSpec.buildSurfaces(mode, ctx)
    const accent = variantSpec.buildAccent(mode, ctx)

    const isLight = mode === 'light'
    const semantic: SemanticColors = {
        background: {
            page: surfaces.page.background,
            panel: surfaces.panel.background,
            card: surfaces.card.background,
            overlay: surfaces.overlay.background,
            inset: surfaces.inset.background,
            muted: isLight ? palette.neutral[100] : palette.neutral[800],
            scrim: hexWithAlpha(palette.neutral[900], isLight ? 0.55 : 0.7),
        },
        foreground: {
            primary: isLight ? palette.neutral[900] : palette.neutral[50],
            secondary: isLight ? palette.neutral[700] : palette.neutral[200],
            // neutral[500] 은 흰 배경에서 4.5:1 을 못 넘긴다. 캡션에도 쓰이는 색이라 한 단계 진하게.
            tertiary: isLight ? palette.neutral[600] : palette.neutral[400],
            muted: isLight ? palette.neutral[400] : palette.neutral[500],
            onAccent: accent.color,
            onPrimary: readableOn(palette.primary[500], palette.neutral[900]),
            onSuccess: readableOn(
                isLight ? palette.success[600] : palette.success[400],
                palette.neutral[900],
            ),
            onWarning: readableOn(
                isLight ? palette.warning[600] : palette.warning[400],
                palette.neutral[900],
            ),
            onDanger: readableOn(
                isLight ? palette.danger[600] : palette.danger[400],
                palette.neutral[900],
            ),
            onInfo: readableOn(
                isLight ? palette.info[600] : palette.info[400],
                palette.neutral[900],
            ),
        },
        border: {
            subtle: isLight ? palette.neutral[200] : palette.neutral[800],
            default: isLight ? palette.neutral[300] : palette.neutral[700],
            strong: isLight ? palette.neutral[400] : palette.neutral[600],
        },
        accent,
        state: {
            success: isLight ? palette.success[600] : palette.success[400],
            warning: isLight ? palette.warning[600] : palette.warning[400],
            danger: isLight ? palette.danger[600] : palette.danger[400],
            info: isLight ? palette.info[600] : palette.info[400],
            disabled: isLight ? palette.neutral[300] : palette.neutral[700],
        },
        focusRing: hexWithAlpha(palette.primary[500], isLight ? 0.32 : 0.45),
        // 순수 검정 대신 팔레트 중립색을 깔아 그림자가 테마 색조를 따라가게 한다.
        // 다크 모드는 표면 자체가 어두우므로 같은 색을 더 높은 알파로 쓴다.
        shadow: {
            ambient: hexWithAlpha(palette.neutral[900], isLight ? 0.04 : 0.32),
            key: hexWithAlpha(palette.neutral[900], isLight ? 0.08 : 0.44),
            strong: hexWithAlpha(palette.neutral[900], isLight ? 0.2 : 0.64),
            glow: hexWithAlpha(palette.primary[500], isLight ? 0.35 : 0.45),
        },
    }

    return {
        paletteName: palette.name,
        variantName,
        mode,
        palette,
        tokens,
        surfaces,
        semantic,
    }
}
