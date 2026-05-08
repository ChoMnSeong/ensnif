export const CSS_VAR_PREFIX = 'ds'

export const toCssVarName = (path: string): string => {
    return `--${CSS_VAR_PREFIX}-${path
        .replace(/\./g, '-')
        .replace(/_/g, '-')
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase()}`
}

export const cssVar = (path: string, fallback?: string): string => {
    const name = toCssVarName(path)
    return fallback ? `var(${name}, ${fallback})` : `var(${name})`
}
