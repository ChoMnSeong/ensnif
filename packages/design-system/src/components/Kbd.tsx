import type { HTMLAttributes, Ref } from 'react'
import { mergeStyles } from './types.js'

export type KbdProps = {
    size?: 'sm' | 'md'
    ref?: Ref<HTMLElement>
} & HTMLAttributes<HTMLElement>

const sizeStyles = {
    sm: { fontSize: '10px', padding: '1px 5px', minWidth: '16px' },
    md: { fontSize: '11px', padding: '2px 6px', minWidth: '20px' },
}

export const Kbd = ({ size = 'md', children, style, ref, ...rest }: KbdProps) => (
    <kbd
        ref={ref}
        style={mergeStyles(
            {
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--ds-typography-fontFamily-mono)',
                fontWeight: 600,
                background: 'var(--ds-color-background-inset)',
                color: 'var(--ds-color-foreground-secondary)',
                border: '1px solid var(--ds-color-border-subtle)',
                borderBottomWidth: '2px',
                borderRadius: 'var(--ds-radius-sm)',
                lineHeight: 1.4,
                ...sizeStyles[size],
            },
            style,
        )}
        {...rest}
    >
        {children}
    </kbd>
)
