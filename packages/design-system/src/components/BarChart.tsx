import { useId, useState, type CSSProperties } from 'react'
import {
    chartDefaults,
    niceMax,
    tooltipBoxStyle,
    type ChartPoint,
    type CommonChartProps,
} from './chartUtils.js'

export type BarChartProps = CommonChartProps & {
    rounded?: boolean
    horizontal?: boolean
    showValueOnBar?: boolean
    /** 값별 색상 다르게 (값 높을수록 진하게). */
    colorByValue?: boolean
    /** 막대 사이 간격 (기본 12). */
    barGap?: number
    /** 0인 값에도 최소 높이 보장 (px). */
    minBarHeight?: number
    /** 수평 기준선. */
    referenceLine?: { value: number; label?: string; color?: string }
}

const { padding, gridColor, labelColor, color: defaultColor } = chartDefaults

export const BarChart = ({
    data,
    height = 240,
    showGrid = true,
    showLabels = true,
    color = defaultColor,
    rounded = true,
    horizontal = false,
    showValueOnBar = false,
    colorByValue = false,
    barGap = 12,
    minBarHeight = 0,
    referenceLine,
    formatValue = (n) => String(n),
    interactive = true,
    style,
}: BarChartProps) => {
    if (horizontal) {
        return (
            <HorizontalBarChart
                data={data}
                color={color}
                showLabels={showLabels}
                rounded={rounded}
                showValueOnBar={showValueOnBar}
                formatValue={formatValue}
                style={style}
            />
        )
    }
    const id = useId().replace(/:/g, '')
    const width = 600
    const max = niceMax(
        Math.max(...data.map((d) => d.value), referenceLine?.value ?? 0),
    )
    const w = width - padding.left - padding.right
    const h = height - padding.top - padding.bottom
    const [hover, setHover] = useState<number | null>(null)

    const barCount = data.length || 1
    const barWidth = Math.max((w - barGap * (barCount - 1)) / barCount, 1)
    const ticks = 4
    const tickValues = Array.from({ length: ticks + 1 }, (_, i) =>
        Math.round((max / ticks) * i),
    )

    const tooltipX =
        hover !== null
            ? ((padding.left +
                  hover * (barWidth + barGap) +
                  barWidth / 2) /
                  width) *
              100
            : 0

    const r = rounded ? Math.min(barWidth / 4, 6) : 0

    const valueColor = (v: number): string => {
        if (!colorByValue) return color
        const ratio = v / max
        if (ratio >= 0.8) return 'var(--ds-palette-primary-700)'
        if (ratio >= 0.6) return 'var(--ds-palette-primary-600)'
        if (ratio >= 0.4) return 'var(--ds-palette-primary-500)'
        if (ratio >= 0.2) return 'var(--ds-palette-primary-400)'
        return 'var(--ds-palette-primary-300)'
    }

    return (
        <div
            style={{
                width: '100%',
                overflow: 'visible',
                position: 'relative',
                ...style,
            }}
        >
            <svg
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                style={{ width: '100%', height }}
            >
                <defs>
                    <linearGradient id={`bar-${id}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="1" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.55" />
                    </linearGradient>
                </defs>
                {showGrid &&
                    tickValues.map((t, idx) => {
                        const y =
                            padding.top + h - (max === 0 ? 0 : (t / max) * h)
                        return (
                            <g key={t}>
                                <line
                                    x1={padding.left}
                                    x2={padding.left + w}
                                    y1={y}
                                    y2={y}
                                    stroke={gridColor}
                                    strokeWidth={idx === 0 ? 1 : 0.5}
                                    strokeDasharray={idx === 0 ? '0' : '2 4'}
                                    opacity={idx === 0 ? 0.6 : 0.5}
                                />
                                {showLabels && (
                                    <text
                                        x={padding.left - 8}
                                        y={y + 3}
                                        textAnchor="end"
                                        fontSize="10"
                                        fill={labelColor}
                                        fontFamily='"JetBrains Mono", monospace'
                                    >
                                        {formatValue(t)}
                                    </text>
                                )}
                            </g>
                        )
                    })}

                {referenceLine && (
                    <g>
                        <line
                            x1={padding.left}
                            x2={padding.left + w}
                            y1={padding.top + h - (referenceLine.value / max) * h}
                            y2={padding.top + h - (referenceLine.value / max) * h}
                            stroke={
                                referenceLine.color ??
                                'var(--ds-color-state-warning)'
                            }
                            strokeWidth="1.5"
                            strokeDasharray="5 4"
                        />
                        {referenceLine.label && (
                            <text
                                x={padding.left + w - 4}
                                y={
                                    padding.top +
                                    h -
                                    (referenceLine.value / max) * h -
                                    4
                                }
                                textAnchor="end"
                                fontSize="10"
                                fontWeight="600"
                                fill={
                                    referenceLine.color ??
                                    'var(--ds-color-state-warning)'
                                }
                            >
                                {referenceLine.label}
                            </text>
                        )}
                    </g>
                )}

                {data.map((d, i) => {
                    const computedH =
                        max === 0 ? 0 : (d.value / max) * h
                    const barH = Math.max(computedH, minBarHeight)
                    const x = padding.left + i * (barWidth + barGap)
                    const y = padding.top + h - barH
                    const isHover = hover === i && interactive
                    const fillColor = colorByValue
                        ? valueColor(d.value)
                        : `url(#bar-${id})`
                    const path =
                        rounded && barH > r
                            ? `M ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} L ${x + barWidth - r} ${y} Q ${x + barWidth} ${y} ${x + barWidth} ${y + r} L ${x + barWidth} ${y + barH} L ${x} ${y + barH} Z`
                            : ''
                    return (
                        <g key={i}>
                            {rounded && barH > r ? (
                                <path
                                    d={path}
                                    fill={fillColor}
                                    opacity={
                                        hover === null || isHover ? 1 : 0.35
                                    }
                                    style={{
                                        transition: 'opacity 160ms ease',
                                        cursor: interactive
                                            ? 'pointer'
                                            : 'default',
                                    }}
                                    onMouseEnter={() =>
                                        interactive && setHover(i)
                                    }
                                    onMouseLeave={() =>
                                        interactive && setHover(null)
                                    }
                                />
                            ) : (
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barH}
                                    rx={r}
                                    ry={r}
                                    fill={fillColor}
                                    opacity={
                                        hover === null || isHover ? 1 : 0.35
                                    }
                                    style={{
                                        transition: 'opacity 160ms ease',
                                        cursor: interactive
                                            ? 'pointer'
                                            : 'default',
                                    }}
                                    onMouseEnter={() =>
                                        interactive && setHover(i)
                                    }
                                    onMouseLeave={() =>
                                        interactive && setHover(null)
                                    }
                                />
                            )}
                            {showLabels && (
                                <text
                                    x={x + barWidth / 2}
                                    y={height - 10}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill={labelColor}
                                    fontFamily='"JetBrains Mono", monospace'
                                    fontWeight={isHover ? 700 : 400}
                                >
                                    {d.label}
                                </text>
                            )}
                            {showValueOnBar && barH > 14 && (
                                <text
                                    x={x + barWidth / 2}
                                    y={y + 14}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="700"
                                    fill="#ffffff"
                                    fontFamily='"JetBrains Mono", monospace'
                                    style={{
                                        pointerEvents: 'none',
                                        paintOrder: 'stroke',
                                        stroke: 'rgba(0,0,0,0.2)',
                                        strokeWidth: 2,
                                    }}
                                >
                                    {formatValue(d.value)}
                                </text>
                            )}
                        </g>
                    )
                })}
            </svg>
            {interactive && hover !== null && data[hover] && (
                <div
                    style={{
                        position: 'absolute',
                        left: `${tooltipX}%`,
                        top: 0,
                        transform: 'translate(-50%, -100%)',
                        marginTop: '-6px',
                        ...tooltipBoxStyle,
                    }}
                >
                    <span style={{ opacity: 0.6, fontSize: '10px', fontWeight: 500 }}>
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
                        {formatValue(data[hover].value)}
                    </span>
                </div>
            )}
        </div>
    )
}

const HorizontalBarChart = ({
    data,
    color,
    showLabels,
    rounded,
    showValueOnBar,
    formatValue,
    style,
}: {
    data: ChartPoint[]
    color: string
    showLabels: boolean
    rounded: boolean
    showValueOnBar: boolean
    formatValue: (n: number) => string
    style?: CSSProperties
}) => {
    const max = niceMax(Math.max(...data.map((d) => d.value), 0))
    const labelWidth = 80
    const valueWidth = 50
    const barHeight = 22
    const rowGap = 10
    const totalHeight = data.length * (barHeight + rowGap) - rowGap

    return (
        <div style={{ width: '100%', ...style }}>
            <svg
                width="100%"
                height={totalHeight}
                viewBox={`0 0 600 ${totalHeight}`}
                preserveAspectRatio="none"
                style={{ display: 'block' }}
            >
                {data.map((d, i) => {
                    const y = i * (barHeight + rowGap)
                    const w =
                        max === 0
                            ? 0
                            : (d.value / max) * (600 - labelWidth - valueWidth)
                    const r = rounded ? Math.min(barHeight / 2, 6) : 0
                    return (
                        <g key={i}>
                            {showLabels && (
                                <text
                                    x={labelWidth - 8}
                                    y={y + barHeight / 2 + 4}
                                    textAnchor="end"
                                    fontSize="11"
                                    fill={labelColor}
                                    fontFamily="inherit"
                                    fontWeight="500"
                                >
                                    {d.label}
                                </text>
                            )}
                            <rect
                                x={labelWidth}
                                y={y}
                                width={w}
                                height={barHeight}
                                rx={r}
                                ry={r}
                                fill={color}
                            />
                            {showValueOnBar && (
                                <text
                                    x={labelWidth + w + 6}
                                    y={y + barHeight / 2 + 4}
                                    fontSize="11"
                                    fontWeight="700"
                                    fill="var(--ds-color-foreground-primary)"
                                    fontFamily='"JetBrains Mono", monospace'
                                >
                                    {formatValue(d.value)}
                                </text>
                            )}
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}
