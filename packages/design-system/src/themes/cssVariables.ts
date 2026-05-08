import type { ResolvedTheme } from './types.js'
import { flattenTokens } from '../utils/flatten.js'
import { toCssVarName } from '../utils/cssVar.js'

export type CssVarMap = Record<string, string>

const surfaceVars = (theme: ResolvedTheme): CssVarMap => {
    const out: CssVarMap = {}
    for (const [level, style] of Object.entries(theme.surfaces)) {
        out[toCssVarName(`surface.${level}.background`)] = style.background
        out[toCssVarName(`surface.${level}.backdrop-filter`)] =
            style.backdropFilter
        out[toCssVarName(`surface.${level}.border`)] = style.border
        out[toCssVarName(`surface.${level}.radius`)] = style.borderRadius
        out[toCssVarName(`surface.${level}.shadow`)] = style.shadow
        out[toCssVarName(`surface.${level}.color`)] = style.color
    }
    return out
}

const semanticVars = (theme: ResolvedTheme): CssVarMap => {
    const flat = flattenTokens(
        theme.semantic as unknown as Record<string, unknown>,
        'color',
    )
    const out: CssVarMap = {}
    for (const [path, value] of Object.entries(flat)) {
        out[toCssVarName(path)] = value
    }
    return out
}

const paletteVars = (theme: ResolvedTheme): CssVarMap => {
    const out: CssVarMap = {}
    const groups: Array<keyof typeof theme.palette> = [
        'primary',
        'neutral',
        'success',
        'warning',
        'danger',
        'info',
    ]
    for (const group of groups) {
        const scale = theme.palette[group]
        if (typeof scale === 'object' && scale !== null) {
            for (const [step, value] of Object.entries(scale)) {
                out[toCssVarName(`palette.${group}.${step}`)] = String(value)
            }
        }
    }
    return out
}

const tokenVars = (theme: ResolvedTheme): CssVarMap => {
    const flat = flattenTokens(theme.tokens as unknown as Record<string, unknown>)
    const out: CssVarMap = {}
    for (const [path, value] of Object.entries(flat)) {
        out[toCssVarName(path)] = value
    }
    return out
}

export const themeToCssVars = (theme: ResolvedTheme): CssVarMap => {
    return {
        ...tokenVars(theme),
        ...paletteVars(theme),
        ...semanticVars(theme),
        ...surfaceVars(theme),
    }
}

export const cssVarsToString = (vars: CssVarMap): string => {
    return Object.entries(vars)
        .map(([k, v]) => `${k}: ${v};`)
        .join('\n')
}

export const cssVarsToInlineStyle = (vars: CssVarMap): Record<string, string> => {
    return vars as Record<string, string>
}
