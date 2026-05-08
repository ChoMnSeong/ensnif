import { buildTheme } from './buildTheme.js'
import { themeToCssVars } from './cssVariables.js'
import type { BuildThemeInput, ResolvedTheme } from './types.js'

export type RenderThemeStyleOptions = {
    selector?: string
    nonce?: string
    indent?: string
}

export type RenderThemeStyleResult = {
    css: string
    styleTag: string
    dataAttrs: Record<string, string>
    vars: Record<string, string>
    theme: ResolvedTheme
}

const escapeHtml = (input: string): string =>
    input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')

const formatCss = (
    selector: string,
    vars: Record<string, string>,
    indent: string,
): string => {
    const lines = Object.entries(vars).map(([k, v]) => `${indent}${k}: ${v};`)
    return `${selector} {\n${lines.join('\n')}\n}`
}

export const renderThemeCss = (
    input: BuildThemeInput,
    options: RenderThemeStyleOptions = {},
): string => {
    const theme = buildTheme(input)
    const vars = themeToCssVars(theme)
    return formatCss(options.selector ?? ':root', vars, options.indent ?? '  ')
}

export const renderThemeStyle = (
    input: BuildThemeInput,
    options: RenderThemeStyleOptions = {},
): RenderThemeStyleResult => {
    const theme = buildTheme(input)
    const vars = themeToCssVars(theme)
    const selector = options.selector ?? ':root'
    const indent = options.indent ?? '  '
    const css = formatCss(selector, vars, indent)
    const nonceAttr = options.nonce ? ` nonce="${escapeHtml(options.nonce)}"` : ''
    const styleTag = `<style data-ds-init="true"${nonceAttr}>${css}</style>`
    return {
        css,
        styleTag,
        dataAttrs: {
            'data-ds-palette': theme.paletteName,
            'data-ds-variant': theme.variantName,
            'data-ds-mode': theme.mode,
        },
        vars,
        theme,
    }
}

export const renderHtmlAttrs = (input: BuildThemeInput): string => {
    const theme = buildTheme(input)
    return [
        `data-ds-palette="${theme.paletteName}"`,
        `data-ds-variant="${theme.variantName}"`,
        `data-ds-mode="${theme.mode}"`,
    ].join(' ')
}

export const injectThemeIntoHtml = (
    html: string,
    input: BuildThemeInput,
    options: RenderThemeStyleOptions = {},
): string => {
    const result = renderThemeStyle(input, options)
    let next = html

    const htmlAttrs = Object.entries(result.dataAttrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ')
    next = next.replace(/<html(\s[^>]*)?>/i, (_match, existing = '') => {
        const cleaned = String(existing).replace(
            /\s*data-ds-(palette|variant|mode)="[^"]*"/gi,
            '',
        )
        const sep = cleaned && !cleaned.endsWith(' ') ? ' ' : ''
        return `<html${cleaned}${sep}${htmlAttrs}>`
    })

    next = next.replace(
        /<\/head>/i,
        (m) => `${result.styleTag}\n${m}`,
    )

    return next
}
