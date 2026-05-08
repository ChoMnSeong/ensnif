import { useState, type CSSProperties, type ReactNode } from 'react'

export type RadialDatum = {
    label: string
    value: number
    color?: string
}

export type RadialChartProps = {
    data: RadialDatum[]
    max?: number
    size?: number
    thickness?: number
    gap?: number
    showLegend?: boolean
    /** 각 링의 호를 따라 카테고리 라벨 표시. */
    showInlineLabels?: boolean
    /** 옅은 동심원 그리드 + 방사형 라인 표시. */
    showGrid?: boolean
    /** 각 링 뒤의 회색 트랙 표시. 기본 true (showGrid=true면 자동 false). */
    showTrack?: boolean
    /** 호 끝 모양: rounded(둥글게) / sharp(뾰족하게/평평하게). */
    cap?: 'rounded' | 'sharp'
    centerLabel?: ReactNode
    centerValue?: ReactNode
    formatValue?: (n: number, max: number) => string
    style?: CSSProperties
}

const DEFAULT_COLORS = [
    'var(--ds-palette-primary-700)',
    'var(--ds-palette-primary-600)',
    'var(--ds-palette-primary-500)',
    'var(--ds-palette-primary-400)',
    'var(--ds-palette-primary-300)',
    'var(--ds-palette-primary-200)',
]

const polar = (cx: number, cy: number, r: number, deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const
}

const arcPath = (
    cx: number,
    cy: number,
    r: number,
    startDeg: number,
    endDeg: number,
): string => {
    const [sx, sy] = polar(cx, cy, r, startDeg)
    const [ex, ey] = polar(cx, cy, r, endDeg)
    const large = endDeg - startDeg <= 180 ? 0 : 1
    return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`
}

const InlineRingLabel = ({
    cx,
    cy,
    r,
    endDeg,
    thickness,
    label,
}: {
    cx: number
    cy: number
    r: number
    endDeg: number
    thickness: number
    label: string
}) => {
    const midDeg = endDeg / 2
    const [x, y] = polar(cx, cy, r, midDeg)
    const inBottomHalf = midDeg > 90 && midDeg < 270
    const rotation = inBottomHalf ? midDeg + 180 : midDeg
    return (
        <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={Math.min(thickness - 4, 11)}
            fontWeight="700"
            fill="#ffffff"
            transform={`rotate(${rotation}, ${x}, ${y})`}
            style={{
                pointerEvents: 'none',
                letterSpacing: '0.02em',
                paintOrder: 'stroke',
                stroke: 'rgba(0,0,0,0.25)',
                strokeWidth: '2',
                strokeLinejoin: 'round',
            }}
        >
            {label}
        </text>
    )
}

export const RadialChart = ({
    data,
    max,
    size = 260,
    thickness = 14,
    gap = 8,
    showLegend = true,
    showInlineLabels = false,
    showGrid = false,
    showTrack,
    cap = 'rounded',
    centerLabel,
    centerValue,
    formatValue,
    style,
}: RadialChartProps) => {
    const cx = size / 2
    const cy = size / 2
    const computedMax = max ?? Math.max(...data.map((d) => d.value), 1)
    const requestedRingStep = thickness + gap
    const hasCenter = !!(centerValue || centerLabel)
    const minHole = hasCenter ? 46 : 22
    const padding = 8
    const outerLimit = size / 2 - padding
    const ringCount = Math.max(data.length, 1)
    const fitRingStep = (outerLimit - minHole) / ringCount
    const ringStep = Math.min(requestedRingStep, fitRingStep)
    const effectiveThickness = Math.min(thickness, Math.max(ringStep - 4, 4))
    const safeInnerStart = outerLimit - ringCount * ringStep
    const trackVisible = showTrack ?? !showGrid
    const [hover, setHover] = useState<number | null>(null)

    const fmt = (d: RadialDatum) => {
        if (formatValue) return formatValue(d.value, computedMax)
        const pct = Math.max(0, Math.min(1, d.value / computedMax))
        return `${Math.round(pct * 100)}%`
    }

    return (
        <div
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '24px',
                ...style,
            }}
        >
            <div style={{ position: 'relative' }}>
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    style={{ display: 'block', overflow: 'visible' }}
                    onMouseLeave={() => setHover(null)}
                >

                    {showGrid && (
                        <g style={{ pointerEvents: 'none' }}>
                            {Array.from({ length: 4 }, (_, i) => {
                                const r =
                                    safeInnerStart +
                                    ((outerLimit - safeInnerStart) * (i + 1)) /
                                        4
                                return (
                                    <circle
                                        key={`grid-${i}`}
                                        cx={cx}
                                        cy={cy}
                                        r={r}
                                        fill="none"
                                        stroke="var(--ds-color-border-subtle)"
                                        strokeWidth="1"
                                    />
                                )
                            })}
                            {Array.from({ length: 12 }, (_, i) => {
                                const deg = i * 30
                                const [x2, y2] = polar(
                                    cx,
                                    cy,
                                    outerLimit + 2,
                                    deg,
                                )
                                return (
                                    <line
                                        key={`spoke-${i}`}
                                        x1={cx}
                                        y1={cy}
                                        x2={x2}
                                        y2={y2}
                                        stroke="var(--ds-color-border-subtle)"
                                        strokeWidth="1"
                                    />
                                )
                            })}
                        </g>
                    )}

                    {data.map((d, i) => {
                        const r = safeInnerStart + i * ringStep
                        const pct = Math.max(
                            0,
                            Math.min(1, d.value / computedMax),
                        )
                        const color =
                            d.color ??
                            DEFAULT_COLORS[i % DEFAULT_COLORS.length]!
                        const endDeg = pct * 359.99
                        const isHover = hover === i
                        return (
                            <g key={i}>
                                {trackVisible && (
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r={r}
                                        fill="none"
                                        stroke="var(--ds-color-background-inset)"
                                        strokeWidth={effectiveThickness}
                                        opacity={0.5}
                                    />
                                )}
                                {pct > 0 && (
                                    <path
                                        d={arcPath(cx, cy, r, 0, endDeg)}
                                        fill="none"
                                        stroke={color}
                                        strokeWidth={
                                            isHover
                                                ? effectiveThickness + 2
                                                : effectiveThickness
                                        }
                                        strokeLinecap={
                                            cap === 'rounded' ? 'round' : 'butt'
                                        }
                                        opacity={
                                            hover === null || isHover
                                                ? 1
                                                : 0.35
                                        }
                                        style={{
                                            transition:
                                                'stroke-width 160ms ease, opacity 160ms ease',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={() => setHover(i)}
                                    />
                                )}
                                {showInlineLabels && pct > 0.12 && (
                                    <InlineRingLabel
                                        cx={cx}
                                        cy={cy}
                                        r={r}
                                        endDeg={endDeg}
                                        thickness={effectiveThickness}
                                        label={d.label}
                                    />
                                )}
                            </g>
                        )
                    })}

                    {(centerLabel || centerValue) && (
                        <g style={{ pointerEvents: 'none' }}>
                            {centerValue && (
                                <text
                                    x={cx}
                                    y={centerLabel ? cy - 2 : cy + 6}
                                    textAnchor="middle"
                                    fontSize="22"
                                    fontWeight="700"
                                    fill="var(--ds-color-foreground-primary)"
                                >
                                    {centerValue}
                                </text>
                            )}
                            {centerLabel && (
                                <text
                                    x={cx}
                                    y={cy + 16}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="600"
                                    fill="var(--ds-color-foreground-tertiary)"
                                    letterSpacing="0.06em"
                                    style={{
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {centerLabel}
                                </text>
                            )}
                        </g>
                    )}
                </svg>

                {hover !== null && data[hover] && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '-8px',
                            left: '50%',
                            transform: 'translate(-50%, -100%)',
                            display: 'inline-flex',
                            flexDirection: 'column',
                            gap: '2px',
                            padding: '8px 12px',
                            background: 'var(--ds-color-foreground-primary)',
                            color: 'var(--ds-color-background-page)',
                            borderRadius: 'var(--ds-radius-md)',
                            fontSize: '11px',
                            fontWeight: 600,
                            boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                        }}
                    >
                        <span style={{ opacity: 0.6, fontSize: '10px' }}>
                            {data[hover].label}
                        </span>
                        <span
                            style={{
                                fontFamily:
                                    'var(--ds-typography-fontFamily-mono)',
                                fontWeight: 700,
                                fontSize: '13px',
                            }}
                        >
                            {fmt(data[hover])}
                        </span>
                    </div>
                )}
            </div>

            {showLegend && (
                <ul
                    style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        minWidth: '140px',
                    }}
                >
                    {data.map((d, i) => {
                        const color =
                            d.color ??
                            DEFAULT_COLORS[i % DEFAULT_COLORS.length]!
                        const isHover = hover === i
                        return (
                            <li
                                key={i}
                                onMouseEnter={() => setHover(i)}
                                onMouseLeave={() => setHover(null)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '4px 8px',
                                    borderRadius: 'var(--ds-radius-sm)',
                                    background: isHover
                                        ? 'var(--ds-color-background-inset)'
                                        : 'transparent',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    transition: 'background 120ms ease',
                                }}
                            >
                                <span
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: color,
                                        flexShrink: 0,
                                    }}
                                />
                                <span
                                    style={{
                                        color: 'var(--ds-color-foreground-secondary)',
                                        fontWeight: isHover ? 700 : 500,
                                        flex: 1,
                                    }}
                                >
                                    {d.label}
                                </span>
                                <span
                                    style={{
                                        color: 'var(--ds-color-foreground-primary)',
                                        fontFamily:
                                            'var(--ds-typography-fontFamily-mono)',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                    }}
                                >
                                    {fmt(d)}
                                </span>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
