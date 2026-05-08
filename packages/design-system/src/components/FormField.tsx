import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { mergeStyles } from './types.js'

export type FormFieldProps = {
    label?: ReactNode
    htmlFor?: string
    required?: boolean
    description?: ReactNode
    error?: ReactNode
    hint?: ReactNode
    children: ReactNode
    ref?: Ref<HTMLDivElement>
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export const FormField = ({
    label,
    htmlFor,
    required,
    description,
    error,
    hint,
    children,
    style,
    ref,
    ...rest
}: FormFieldProps) => (
    <div
        ref={ref}
        style={mergeStyles(
            {
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
            },
            style,
        )}
        {...rest}
    >
        {label && (
            <label
                htmlFor={htmlFor}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--ds-color-foreground-secondary)',
                    lineHeight: 1.4,
                }}
            >
                {label}
                {required && (
                    <span
                        aria-hidden
                        style={{ color: 'var(--ds-color-state-danger)' }}
                    >
                        *
                    </span>
                )}
            </label>
        )}
        {description && (
            <span
                style={{
                    fontSize: '11px',
                    color: 'var(--ds-color-foreground-tertiary)',
                    lineHeight: 1.5,
                }}
            >
                {description}
            </span>
        )}
        {children}
        {(error || hint) && (
            <span
                style={{
                    fontSize: '11px',
                    color: error
                        ? 'var(--ds-color-state-danger)'
                        : 'var(--ds-color-foreground-tertiary)',
                    lineHeight: 1.5,
                }}
            >
                {error ?? hint}
            </span>
        )}
    </div>
)

export type FormProps = HTMLAttributes<HTMLFormElement> & {
    ref?: Ref<HTMLFormElement>
}

export const Form = ({ style, ref, ...rest }: FormProps) => (
    <form
        ref={ref}
        style={mergeStyles(
            { display: 'flex', flexDirection: 'column', gap: '16px' },
            style,
        )}
        {...rest}
    />
)
