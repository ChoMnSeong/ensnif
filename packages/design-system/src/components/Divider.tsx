import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { mergeStyles } from './types.js'

export type DividerProps = {
    orientation?: 'horizontal' | 'vertical'
    label?: ReactNode
    inset?: boolean
} & HTMLAttributes<HTMLDivElement>

export const Divider = ({
    orientation = 'horizontal',
    label,
    inset,
    style,
    ...rest
}: DividerProps) => {
    if (orientation === 'vertical') {
        return (
            <div
                role="separator"
                aria-orientation="vertical"
                style={mergeStyles(
                    {
                        width: '1px',
                        alignSelf: 'stretch',
                        background: 'var(--ds-color-border-subtle)',
                        margin: inset ? '0 8px' : 0,
                    },
                    style,
                )}
                {...rest}
            />
        )
    }
    if (label) {
        return (
            <div
                role="separator"
                style={mergeStyles(
                    {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        margin: inset ? '0 12px' : 0,
                        color: 'var(--ds-color-foreground-tertiary)',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                    },
                    style,
                )}
                {...rest}
            >
                <Line />
                <span>{label}</span>
                <Line />
            </div>
        )
    }
    return (
        <div
            role="separator"
            style={mergeStyles(
                {
                    height: '1px',
                    background: 'var(--ds-color-border-subtle)',
                    margin: inset ? '12px 0' : 0,
                    border: 'none',
                },
                style,
            )}
            {...rest}
        />
    )
}

const Line = () => (
    <span
        style={{
            flex: 1,
            height: '1px',
            background: 'var(--ds-color-border-subtle)',
        }}
    />
)
