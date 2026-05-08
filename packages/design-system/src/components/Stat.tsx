import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { mergeStyles } from './types.js'
import {
    borderVariantContainerStyle,
    type BorderVariant,
} from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

export type StatProps = {
    label: ReactNode
    value: ReactNode
    helper?: ReactNode
    delta?: { value: ReactNode; tone?: 'success' | 'danger' | 'neutral' }
    icon?: ReactNode
    variant?: BorderVariant
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

const toneColor = (t: 'success' | 'danger' | 'neutral'): string => {
    if (t === 'success') return 'var(--ds-color-state-success)'
    if (t === 'danger') return 'var(--ds-color-state-danger)'
    return 'var(--ds-color-foreground-tertiary)'
}

export const Stat = ({
    label,
    value,
    helper,
    delta,
    icon,
    variant: variantProp,
    style,
    ref,
    ...rest
}: StatProps) => {
    const variant = useBorderVariant(variantProp)
    const containerStyle =
        variant === 'outlined'
            ? {
                  background: 'var(--ds-color-background-card)',
                  border: '1px solid var(--ds-color-border-subtle)',
                  borderRadius: 'var(--ds-radius-lg)',
              }
            : borderVariantContainerStyle(variant, { surfaceToken: 'card' })
    return (
    <div
        ref={ref}
        style={mergeStyles(
            {
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '16px 18px',
                minWidth: '180px',
                ...containerStyle,
            },
            style,
        )}
        {...rest}
    >
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <span
                style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--ds-color-foreground-tertiary)',
                }}
            >
                {label}
            </span>
            {icon && (
                <span
                    style={{
                        color: 'var(--ds-color-foreground-tertiary)',
                        display: 'inline-flex',
                    }}
                >
                    {icon}
                </span>
            )}
        </div>
        <div
            style={{
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--ds-color-foreground-primary)',
                lineHeight: 1.1,
            }}
        >
            {value}
        </div>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
            }}
        >
            {delta && (
                <span
                    style={{
                        color: toneColor(delta.tone ?? 'neutral'),
                        fontWeight: 600,
                    }}
                >
                    {delta.value}
                </span>
            )}
            {helper && (
                <span
                    style={{
                        color: 'var(--ds-color-foreground-tertiary)',
                    }}
                >
                    {helper}
                </span>
            )}
        </div>
    </div>
    )
}
