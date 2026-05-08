import type { HTMLAttributes, Ref } from 'react'
import { mergeStyles } from './types.js'

export type ToolbarProps = {
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

export const Toolbar = ({ style, ref, ...rest }: ToolbarProps) => (
    <div
        role="toolbar"
        ref={ref}
        style={mergeStyles(
            {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px',
                background: 'var(--ds-color-background-card)',
                border: '1px solid var(--ds-color-border-subtle)',
                borderRadius: 'var(--ds-radius-md)',
                boxShadow: 'var(--ds-shadow-sm)',
            },
            style,
        )}
        {...rest}
    />
)

export type ToolbarSeparatorProps = HTMLAttributes<HTMLDivElement>

export const ToolbarSeparator = ({ style, ...rest }: ToolbarSeparatorProps) => (
    <div
        role="separator"
        aria-orientation="vertical"
        style={mergeStyles(
            {
                width: '1px',
                alignSelf: 'stretch',
                margin: '4px 2px',
                background: 'var(--ds-color-border-subtle)',
            },
            style,
        )}
        {...rest}
    />
)

export type ToolbarGroupProps = HTMLAttributes<HTMLDivElement>

export const ToolbarGroup = ({ style, ...rest }: ToolbarGroupProps) => (
    <div
        role="group"
        style={mergeStyles(
            { display: 'inline-flex', alignItems: 'center', gap: '2px' },
            style,
        )}
        {...rest}
    />
)
