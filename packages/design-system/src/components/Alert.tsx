import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'
import { mergeStyles, toneColor, type Tone } from './types.js'
import {
    IconClose,
    IconError,
    IconInfo,
    IconSuccess,
    IconWarning,
    type IconType,
} from './icons.js'
import type { BorderVariant } from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

export type AlertProps = {
    tone?: Exclude<Tone, 'accent' | 'neutral'> | 'info'
    title?: ReactNode
    icon?: ReactNode
    variant?: BorderVariant
    onClose?: () => void
    ref?: Ref<HTMLDivElement>
} & Omit<HTMLAttributes<HTMLDivElement>, 'title'>

const baseStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    padding: '14px 16px',
    alignItems: 'flex-start',
}

const defaultIcon: Record<string, IconType> = {
    info: IconInfo,
    success: IconSuccess,
    warning: IconWarning,
    danger: IconError,
}

const containerStyle = (
    variant: BorderVariant,
    color: string,
): CSSProperties => {
    switch (variant) {
        case 'underline':
            return {
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${color}`,
                borderRadius: 0,
            }
        case 'filled':
            return {
                background: `color-mix(in srgb, ${color} 12%, transparent)`,
                border: 'none',
                borderLeft: `3px solid ${color}`,
                borderRadius: 'var(--ds-radius-md)',
            }
        case 'ghost':
            return {
                background: 'transparent',
                border: 'none',
                borderLeft: `3px solid ${color}`,
                borderRadius: 'var(--ds-radius-md)',
            }
        case 'outlined':
        default:
            return {
                background: 'var(--ds-color-background-card)',
                border: '1px solid var(--ds-color-border-subtle)',
                borderLeft: `3px solid ${color}`,
                borderRadius: 'var(--ds-radius-md)',
            }
    }
}

export const Alert = ({
    tone = 'info',
    title,
    icon,
    variant: variantProp,
    onClose,
    children,
    style,
    ref,
    ...rest
}: AlertProps) => {
    const variant = useBorderVariant(variantProp)
    const color = toneColor(tone)
    const Icon = defaultIcon[tone]
    return (
        <div
            ref={ref}
            role="alert"
            style={mergeStyles(baseStyle, containerStyle(variant, color), style)}
            {...rest}
        >
            <span
                aria-hidden
                style={{
                    color,
                    marginTop: '1px',
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {icon ?? (Icon && <Icon size={18} />)}
            </span>
            <div style={{ flex: 1 }}>
                {title && (
                    <div
                        style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            marginBottom: children ? '2px' : 0,
                            color: 'var(--ds-color-foreground-primary)',
                        }}
                    >
                        {title}
                    </div>
                )}
                {children && (
                    <div
                        style={{
                            fontSize: '12px',
                            color: 'var(--ds-color-foreground-secondary)',
                            lineHeight: 1.5,
                        }}
                    >
                        {children}
                    </div>
                )}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    aria-label="Close"
                    style={{
                        flexShrink: 0,
                        width: '22px',
                        height: '22px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--ds-color-foreground-tertiary)',
                        cursor: 'pointer',
                        padding: 0,
                        borderRadius: 'var(--ds-radius-sm)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <IconClose size={16} />
                </button>
            )}
        </div>
    )
}
