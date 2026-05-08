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
    let base: { name: string; label: string; primary: ColorScale; neutral: ColorScale }
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
            neutral: 'neutral' in input && input.neutral ? input.neutral : zincNeutral,
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
        deepMerge(baseTokens as unknown as Record<string, unknown>, {
            ...(variantSpec.tokenOverrides as Partial<BaseTokens>),
        } as Record<string, unknown>),
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
        },
        foreground: {
            primary: isLight ? palette.neutral[900] : palette.neutral[50],
            secondary: isLight ? palette.neutral[700] : palette.neutral[200],
            tertiary: isLight ? palette.neutral[500] : palette.neutral[400],
            muted: isLight ? palette.neutral[400] : palette.neutral[500],
            onAccent: accent.color,
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
        focusRing: hexWithAlpha(
            palette.primary[500],
            isLight ? 0.32 : 0.45,
        ),
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
