import type { CSSProperties, HTMLAttributes } from 'react'
import { IconChevronLeft, IconChevronRight } from './icons.js'
import { mergeStyles } from './types.js'
import type { BorderVariant } from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

export type PaginationProps = {
    page: number
    pageCount: number
    onChange: (page: number) => void
    siblings?: number
    showEdges?: boolean
    variant?: BorderVariant
} & Omit<HTMLAttributes<HTMLElement>, 'onChange'>

const inactiveAppearance = (
    variant: BorderVariant,
    disabled?: boolean,
): CSSProperties => {
    const color = disabled
        ? 'var(--ds-color-foreground-muted)'
        : 'var(--ds-color-foreground-secondary)'
    switch (variant) {
        case 'underline':
            return {
                background: 'transparent',
                border: 'none',
                borderRadius: 0,
                color,
            }
        case 'filled':
            return {
                background: 'var(--ds-color-background-inset)',
                border: '1px solid transparent',
                borderRadius: 'var(--ds-radius-sm)',
                color,
            }
        case 'ghost':
            return {
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--ds-radius-sm)',
                color,
            }
        case 'outlined':
        default:
            return {
                background: 'transparent',
                border: '1px solid var(--ds-color-border-subtle)',
                borderRadius: 'var(--ds-radius-sm)',
                color,
            }
    }
}

const activeAppearance = (variant: BorderVariant): CSSProperties => {
    switch (variant) {
        case 'underline':
            return {
                background: 'transparent',
                color: 'var(--ds-palette-primary-500)',
                border: 'none',
                borderBottom: '2px solid var(--ds-palette-primary-500)',
                borderRadius: 0,
            }
        case 'filled':
            return {
                background: 'var(--ds-color-background-inset)',
                color: 'var(--ds-palette-primary-500)',
                border: '1px solid transparent',
                borderRadius: 'var(--ds-radius-sm)',
            }
        case 'ghost':
            return {
                background: 'transparent',
                color: 'var(--ds-palette-primary-500)',
                border: 'none',
                borderRadius: 'var(--ds-radius-sm)',
            }
        case 'outlined':
        default:
            return {
                background: 'var(--ds-color-accent-background)',
                color: 'var(--ds-color-accent-color)',
                border: 'var(--ds-color-accent-border)',
                borderRadius: 'var(--ds-radius-sm)',
            }
    }
}

const pageButton = (
    active: boolean,
    variant: BorderVariant,
    disabled?: boolean,
): CSSProperties => {
    if (active) {
        return {
            minWidth: '32px',
            height: '32px',
            padding: '0 8px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 100ms ease',
            ...activeAppearance(variant),
        }
    }
    return {
        minWidth: '32px',
        height: '32px',
        padding: '0 8px',
        fontSize: '12px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 100ms ease',
        ...inactiveAppearance(variant, disabled),
    }
}

const buildRange = (
    page: number,
    pageCount: number,
    siblings: number,
): (number | 'dots')[] => {
    const total = siblings * 2 + 5
    if (pageCount <= total) {
        return Array.from({ length: pageCount }, (_, i) => i + 1)
    }
    const left = Math.max(2, page - siblings)
    const right = Math.min(pageCount - 1, page + siblings)
    const showLeftDots = left > 2
    const showRightDots = right < pageCount - 1

    const out: (number | 'dots')[] = [1]
    if (showLeftDots) out.push('dots')
    for (let i = left; i <= right; i++) out.push(i)
    if (showRightDots) out.push('dots')
    out.push(pageCount)
    return out
}

export const Pagination = ({
    page,
    pageCount,
    onChange,
    siblings = 1,
    showEdges = true,
    variant: variantProp,
    style,
    ...rest
}: PaginationProps) => {
    const variant = useBorderVariant(variantProp)
    const range = buildRange(page, pageCount, siblings)
    return (
        <nav
            aria-label="Pagination"
            style={mergeStyles(
                {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                },
                style,
            )}
            {...rest}
        >
            {showEdges && (
                <button
                    type="button"
                    aria-label="Previous"
                    disabled={page <= 1}
                    onClick={() => onChange(page - 1)}
                    data-ds-focusable=""
                    style={pageButton(false, variant, page <= 1)}
                >
                    <IconChevronLeft size={14} />
                </button>
            )}
            {range.map((item, idx) =>
                item === 'dots' ? (
                    <span
                        key={`d-${idx}`}
                        style={{
                            minWidth: '32px',
                            textAlign: 'center',
                            color: 'var(--ds-color-foreground-muted)',
                            fontSize: '12px',
                        }}
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        onClick={() => onChange(item)}
                        data-ds-focusable=""
                        aria-current={item === page ? 'page' : undefined}
                        style={pageButton(item === page, variant)}
                    >
                        {item}
                    </button>
                ),
            )}
            {showEdges && (
                <button
                    type="button"
                    aria-label="Next"
                    disabled={page >= pageCount}
                    onClick={() => onChange(page + 1)}
                    data-ds-focusable=""
                    style={pageButton(false, variant, page >= pageCount)}
                >
                    <IconChevronRight size={14} />
                </button>
            )}
        </nav>
    )
}
