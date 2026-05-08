import { isPlainObject } from './deepMerge.js'

export type FlatTokens = Record<string, string>

export const flattenTokens = (
    obj: Record<string, unknown>,
    prefix = '',
): FlatTokens => {
    const result: FlatTokens = {}
    for (const key of Object.keys(obj)) {
        const value = obj[key]
        const path = prefix ? `${prefix}.${key}` : key
        if (isPlainObject(value)) {
            Object.assign(result, flattenTokens(value, path))
        } else if (typeof value === 'string' || typeof value === 'number') {
            result[path] = String(value)
        }
    }
    return result
}
