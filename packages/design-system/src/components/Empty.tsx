import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { mergeStyles } from './types.js'

export type EmptyProps = {
    icon?: ReactNode
    title?: ReactNode
    description?: ReactNode
    action?: ReactNode
    ref?: Ref<HTMLDivElement>
} & Omit<HTMLAttributes<HTMLDivElement>, 'title'>

export const Empty = ({
    icon,
    title,
    description,
    action,
    style,
    ref,
    ...rest
}: EmptyProps) => (
    <div
        ref={ref}
        style={mergeStyles(
            {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '40px 24px',
                textAlign: 'center',
                color: 'var(--ds-color-foreground-tertiary)',
            },
            style,
        )}
        {...rest}
    >
        {icon && (
            <div
                style={{
                    fontSize: '40px',
                    opacity: 0.5,
                    marginBottom: '8px',
                    color: 'var(--ds-color-foreground-muted)',
                }}
            >
                {icon}
            </div>
        )}
        {title && (
            <div
                style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--ds-color-foreground-primary)',
                }}
            >
                {title}
            </div>
        )}
        {description && (
            <div
                style={{
                    fontSize: '13px',
                    maxWidth: '320px',
                    lineHeight: 1.6,
                }}
            >
                {description}
            </div>
        )}
        {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
)
