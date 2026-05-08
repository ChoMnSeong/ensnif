import type {
    CSSProperties,
    HTMLAttributes,
    TableHTMLAttributes,
    TdHTMLAttributes,
    ThHTMLAttributes,
    Ref,
} from 'react'
import { mergeStyles } from './types.js'
import type { BorderVariant } from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

export type TableProps = {
    striped?: boolean
    hoverable?: boolean
    variant?: BorderVariant
    ref?: Ref<HTMLTableElement>
} & TableHTMLAttributes<HTMLTableElement>

const wrapperStyle = (variant: BorderVariant): CSSProperties => {
    switch (variant) {
        case 'underline':
            return {
                background: 'transparent',
                border: 'none',
                borderTop: '1px solid var(--ds-color-border-subtle)',
                borderRadius: 0,
                overflow: 'visible',
            }
        case 'filled':
            return {
                background: 'var(--ds-color-background-inset)',
                border: 'none',
                borderRadius: 'var(--ds-radius-md)',
                overflow: 'hidden',
            }
        case 'ghost':
            return {
                background: 'transparent',
                border: 'none',
                borderRadius: 0,
                overflow: 'visible',
            }
        case 'outlined':
        default:
            return {
                background: 'var(--ds-color-background-card)',
                border: '1px solid var(--ds-color-border-subtle)',
                borderRadius: 'var(--ds-radius-md)',
                overflow: 'hidden',
            }
    }
}

export const Table = ({
    striped: _striped,
    hoverable: _hoverable,
    variant: variantProp,
    style,
    ref,
    ...rest
}: TableProps) => {
    const variant = useBorderVariant(variantProp)
    return (
        <div style={wrapperStyle(variant)}>
            <table
                ref={ref}
                style={mergeStyles(
                    {
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '13px',
                        color: 'var(--ds-color-foreground-primary)',
                        fontFamily: 'inherit',
                    },
                    style,
                )}
                {...rest}
            />
        </div>
    )
}

export const TableHead = ({
    style,
    ...rest
}: HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
        style={mergeStyles(
            {
                background: 'var(--ds-color-background-inset)',
                borderBottom: '1px solid var(--ds-color-border-subtle)',
            },
            style,
        )}
        {...rest}
    />
)

export const TableBody = (rest: HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody {...rest} />
)

export const TableRow = ({
    style,
    ...rest
}: HTMLAttributes<HTMLTableRowElement>) => (
    <tr
        style={mergeStyles(
            {
                borderBottom: '1px solid var(--ds-color-border-subtle)',
            },
            style,
        )}
        {...rest}
    />
)

export const TableHeaderCell = ({
    style,
    ...rest
}: ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
        style={mergeStyles(
            {
                padding: '10px 14px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--ds-color-foreground-tertiary)',
            },
            style,
        )}
        {...rest}
    />
)

export const TableCell = ({
    style,
    ...rest
}: TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
        style={mergeStyles(
            {
                padding: '12px 14px',
                color: 'var(--ds-color-foreground-secondary)',
            },
            style,
        )}
        {...rest}
    />
)
