import type { CSSProperties } from 'react'

export type BorderVariant = 'outlined' | 'underline' | 'filled' | 'ghost'

/** @deprecated use BorderVariant */
export type InputVariant = BorderVariant

export type SurfaceToken = 'inset' | 'card' | 'panel' | 'overlay'

export type BorderVariantStyleOptions = {
    invalid?: boolean
    /** Which surface token group to use for the 'outlined' fallback. */
    surfaceToken?: SurfaceToken
}

export const borderVariantContainerStyle = (
    variant: BorderVariant,
    options: BorderVariantStyleOptions = {},
): CSSProperties => {
    const { invalid = false, surfaceToken = 'inset' } = options
    const danger = 'var(--ds-color-state-danger)'
    const sp = `--ds-surface-${surfaceToken}`

    if (invalid) {
        switch (variant) {
            case 'underline':
                return {
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `2px solid ${danger}`,
                    borderRadius: 0,
                    boxShadow: 'none',
                }
            case 'filled':
                return {
                    background: 'var(--ds-color-background-inset)',
                    border: `1px solid ${danger}`,
                    borderRadius: 'var(--ds-radius-md)',
                    boxShadow: 'none',
                }
            case 'ghost':
                return {
                    background: 'transparent',
                    border: `1px solid ${danger}`,
                    borderRadius: 'var(--ds-radius-md)',
                    boxShadow: 'none',
                }
            case 'outlined':
            default:
                return {
                    background: `var(${sp}-background)`,
                    border: `1px solid ${danger}`,
                    borderRadius: `var(${sp}-radius)`,
                    boxShadow: 'none',
                }
        }
    }
    switch (variant) {
        case 'underline':
            return {
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--ds-color-border-default)',
                borderRadius: 0,
                boxShadow: 'none',
            }
        case 'filled':
            return {
                background: 'var(--ds-color-background-inset)',
                border: '1px solid transparent',
                borderRadius: 'var(--ds-radius-md)',
                boxShadow: 'none',
            }
        case 'ghost':
            return {
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: 'var(--ds-radius-md)',
                boxShadow: 'none',
            }
        case 'outlined':
        default:
            return {
                background: `var(${sp}-background)`,
                border: `var(${sp}-border)`,
                borderRadius: `var(${sp}-radius)`,
                boxShadow: `var(${sp}-shadow)`,
            }
    }
}

/** @deprecated use borderVariantContainerStyle */
export const inputVariantContainerStyle = (
    variant: BorderVariant,
    invalid: boolean,
): CSSProperties =>
    borderVariantContainerStyle(variant, { invalid, surfaceToken: 'inset' })
