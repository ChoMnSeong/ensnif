import type { LabelHTMLAttributes, Ref } from 'react'
import { mergeStyles } from './types.js'

export type LabelProps = {
    required?: boolean
    ref?: Ref<HTMLLabelElement>
} & LabelHTMLAttributes<HTMLLabelElement>

export const Label = ({
    required,
    children,
    style,
    ref,
    ...rest
}: LabelProps) => (
    <label
        ref={ref}
        style={mergeStyles(
            {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--ds-color-foreground-secondary)',
                lineHeight: 1.4,
            },
            style,
        )}
        {...rest}
    >
        {children}
        {required && (
            <span
                aria-hidden
                style={{
                    color: 'var(--ds-color-state-danger)',
                    marginLeft: '2px',
                }}
            >
                *
            </span>
        )}
    </label>
)
