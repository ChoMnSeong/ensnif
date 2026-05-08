import type { CSSProperties, ReactNode } from 'react'

export type GaugeProps = {
    value: number
    max?: number
    size?: number
    thickness?: number
    color?: string
    trackColor?: string
    label?: ReactNode
    formatValue?: (n: number, max: number) => string
    style?: CSSProperties
}

export const Gauge = ({
    value,
    max = 100,
    size = 140,
    thickness = 12,
    color = 'var(--ds-color-accent-background)',
    trackColor = 'var(--ds-color-background-inset)',
    label,
    formatValue,
    style,
}: GaugeProps) => {
    const pct = Math.max(0, Math.min(1, value / max))
    const r = size / 2 - thickness / 2
    const c = 2 * Math.PI * r
    const dash = c * pct
    const cx = size / 2
    const cy = size / 2

    return (
        <div
            style={{
                position: 'relative',
                display: 'inline-block',
                width: `${size}px`,
                height: `${size}px`,
                ...style,
            }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{
                    transform: 'rotate(-90deg)',
                    display: 'block',
                }}
            >
                <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={trackColor}
                    strokeWidth={thickness}
                />
                <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={thickness}
                    strokeDasharray={`${dash} ${c - dash}`}
                    strokeLinecap="round"
                    style={{
                        transition: 'stroke-dasharray 320ms ease',
                    }}
                />
            </svg>
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                }}
            >
                <span
                    style={{
                        fontSize: '22px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--ds-color-foreground-primary)',
                    }}
                >
                    {formatValue ? formatValue(value, max) : `${Math.round(pct * 100)}%`}
                </span>
                {label && (
                    <span
                        style={{
                            fontSize: '11px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            marginTop: '2px',
                        }}
                    >
                        {label}
                    </span>
                )}
            </div>
        </div>
    )
}
