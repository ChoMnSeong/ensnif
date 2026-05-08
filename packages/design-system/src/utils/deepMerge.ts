export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    if (value === null || typeof value !== 'object') return false
    const proto = Object.getPrototypeOf(value)
    return proto === Object.prototype || proto === null
}

export const deepMerge = <T extends Record<string, unknown>>(
    base: T,
    override: Partial<T> | undefined,
): T => {
    if (!override) return base
    const result: Record<string, unknown> = { ...base }
    for (const key of Object.keys(override)) {
        const baseVal = (base as Record<string, unknown>)[key]
        const overrideVal = (override as Record<string, unknown>)[key]
        if (overrideVal === undefined) continue
        if (isPlainObject(baseVal) && isPlainObject(overrideVal)) {
            result[key] = deepMerge(baseVal, overrideVal as Record<string, unknown>)
        } else {
            result[key] = overrideVal
        }
    }
    return result as T
}
