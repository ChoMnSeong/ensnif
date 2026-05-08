import type { CSSProperties } from 'react'

export type Size = 'sm' | 'md' | 'lg'
export type Tone =
    | 'accent'
    | 'neutral'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'

export const mergeStyles = (
    ...parts: Array<CSSProperties | undefined | false | null>
): CSSProperties =>
    parts.reduce<CSSProperties>(
        (acc, part) => (part ? { ...acc, ...part } : acc),
        {},
    )

export const sizeText: Record<Size, string> = {
    sm: '12px',
    md: '14px',
    lg: '15px',
}

export const sizePadX: Record<Size, string> = {
    sm: '10px',
    md: '14px',
    lg: '18px',
}

export const sizePadY: Record<Size, string> = {
    sm: '6px',
    md: '9px',
    lg: '12px',
}

export const sizeHeight: Record<Size, string> = {
    sm: '28px',
    md: '36px',
    lg: '44px',
}

export const toneColor = (tone: Tone): string => {
    switch (tone) {
        case 'accent':
            return 'var(--ds-palette-primary-500)'
        case 'success':
            return 'var(--ds-color-state-success)'
        case 'warning':
            return 'var(--ds-color-state-warning)'
        case 'danger':
            return 'var(--ds-color-state-danger)'
        case 'info':
            return 'var(--ds-color-state-info)'
        case 'neutral':
        default:
            return 'var(--ds-color-foreground-secondary)'
    }
}
