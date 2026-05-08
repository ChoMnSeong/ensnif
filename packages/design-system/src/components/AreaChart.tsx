import { useId, useState, type CSSProperties } from 'react'
import { smoothPath } from './Chart.js'

export type AreaSeries = {
    label: string
    color?: string
    values: number[]
}

export type AreaChartProps = {
    labels: string[]
    series: AreaSeries[]
    height?: number
    showGrid?: boolean
    showLabels?: boolean
    showLegend?: boolean
    fillOpacity?: number
    smooth?: boolean
    formatValue?: (n: number) => string
    style?: CSSProperties
}

const DEFAULT_COLORS = [
    'var(--ds-palette-primary-500)',
    'var(--ds-palette-primary-700)',
    'var(--ds-palette-primary-300)',
    'var(--ds-palette-primary-400)',
]

const padding = { top: 16, right: 16, bottom: 28, left: 36 }

const niceMax = (max: number): number => {
    if (max <= 0) return 1
    const exp = Math.floor(Math.log10(max))
    const base = Math.pow(10, exp)
    const norm = max / base
    let nice
    if (norm <= 1) nice = 1
    else if (norm <= 2) nice = 2
    else if (norm <= 5) nice = 5
    else nice = 10
    return nice * base
}

const labelColor = 'var(--ds-color-foreground-tertiary)'
const gridColor = 'var(--ds-color-border-subtle)'

export const AreaChart = ({
    labels,
    series,
    height = 240,
    showGrid = true,
    showLabels = true,
    showLegend = true,
    fillOpacity = 0.22,
    smooth = true,
    formatValue = (n) => String(n),
    style,
}: AreaChartProps) => {
    const id = useId().replace(/:/g, '')
    const width = 600
    const allValues = series.flatMap((s) => s.values)
    const max = niceMax(Math.max(...allValues, 0))
    const w = width - padding.left - padding.right
    const h = height - padding.top - padding.bottom

    const px = (i: number) =>
        labels.length === 1
            ? padding.left + w / 2
            : padding.left + (i / (labels.length - 1)) * w
    const py = (v: number) =>
        padding.top + h - (max === 0 ? 0 : (v / max) * h)

    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    const [hoverPct, setHoverPct] = useState<number>(0)

    const ticks = 4
    const tickValues = Array.from({ length: ticks + 1 }, (_, i) =>
        Math.round((max / ticks) * i),
    )

    const onMove = (e: React.MouseEvent<SVGRectElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const xRatio = (e.clientX - rect.left) / rect.width
        const x = xRatio * width - padding.left
        const i = Math.round((x / w) * Math.max(labels.length - 1, 1))
        const clamped = Math.max(0, Math.min(labels.length - 1, i))
        setHoverIndex(clamped)
        setHoverPct((px(clamped) / width) * 100)
    }

    return (
        <div
            style={{
                width: '100%',
                position: 'relative',
                overflow: 'visible',
                ...style,
            }}
        >
            <svg
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                style={{ width: '100%', height }}
            >
                <defs>
                    {series.map((s, idx) => {
                        const color = s.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length]!
                        return (
                            <linearGradient
                                key={`g-${id}-${idx}`}
                                id={`g-${id}-${idx}`}
                                x1="0"
                                x2="0"
                                y1="0"
                                y2="1"
                            >
                                <stop offset="0%" stopColor={color} stopOpacity={fillOpacity * 1.4} />
                                <stop offset="100%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        )
                    })}
                </defs>

                {showGrid &&
                    tickValues.map((t) => {
                        const y = py(t)
                        return (
                            <g key={t}>
                                <line
                                    x1={padding.left}
                                    x2={padding.left + w}
                                    y1={y}
                                    y2={y}
                                    stroke={gridColor}
                                    strokeDasharray="3 4"
                                />
                                {showLabels && (
                                    <text
                                        x={padding.left - 6}
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

                {series.map((s, idx) => {
                    const color = s.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length]!
                    const points: [number, number][] = s.values.map(
                        (v, i) => [px(i), py(v)],
                    )
                    const linePath = smooth
                        ? smoothPath(points)
                        : points
                              .map(
                                  (p, i) =>
                                      `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`,
                              )
                              .join(' ')
                    const areaPath =
                        points.length > 1
                            ? `${linePath} L${points[points.length - 1]![0]},${padding.top + h} L${points[0]![0]},${padding.top + h} Z`
                            : ''
                    return (
                        <g key={`s-${id}-${idx}`}>
                            <path d={areaPath} fill={`url(#g-${id}-${idx})`} />
                            <path
                                d={linePath}
                                fill="none"
                                stroke={color}
                                strokeWidth="2"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                            {s.values.map((v, i) => (
                                <circle
                                    key={i}
                                    cx={px(i)}
                                    cy={py(v)}
                                    r={hoverIndex === i ? 4.5 : 2.5}
                                    fill={color}
                                    style={{ transition: 'r 120ms ease' }}
                                />
                            ))}
                        </g>
                    )
                })}

                {hoverIndex !== null && (
                    <line
                        x1={px(hoverIndex)}
                        x2={px(hoverIndex)}
                        y1={padding.top}
                        y2={padding.top + h}
                        stroke={gridColor}
                        strokeDasharray="2 3"
                    />
                )}

                {showLabels &&
                    labels.map((lbl, i) => (
                        <text
                            key={i}
                            x={px(i)}
                            y={height - 8}
                            textAnchor="middle"
                            fontSize="10"
                            fill={labelColor}
                            fontFamily='"JetBrains Mono", monospace'
                        >
                            {lbl}
                        </text>
                    ))}

                <rect
                    x={padding.left}
                    y={padding.top}
                    width={w}
                    height={h}
                    fill="transparent"
                    onMouseMove={onMove}
                    onMouseLeave={() => setHoverIndex(null)}
                />
            </svg>

            {hoverIndex !== null && (
                <div
                    style={{
                        position: 'absolute',
                        left: `${hoverPct}%`,
                        top: 0,
                        transform: 'translate(-50%, -100%)',
                        marginTop: '-8px',
                        padding: '8px 12px',
                        background: 'var(--ds-color-foreground-primary)',
                        color: 'var(--ds-color-background-page)',
                        borderRadius: 'var(--ds-radius-md)',
                        fontSize: '11px',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                    }}
                >
                    <span
                        style={{
                            opacity: 0.6,
                            fontSize: '10px',
                            fontWeight: 500,
                        }}
                    >
                        {labels[hoverIndex]}
                    </span>
                    {series.map((s, idx) => {
                        const color =
                            s.color ??
                            DEFAULT_COLORS[idx % DEFAULT_COLORS.length]!
                        return (
                            <span
                                key={idx}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <span
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        background: color,
                                        borderRadius: '50%',
                                        flexShrink: 0,
                                    }}
                                />
                                <span style={{ opacity: 0.7 }}>
                                    {s.label}
                                </span>
                                <span
                                    style={{
                                        marginLeft: 'auto',
                                        fontFamily:
                                            'var(--ds-typography-fontFamily-mono)',
                                        fontWeight: 700,
                                        fontSize: '12px',
                                    }}
                                >
                                    {formatValue(s.values[hoverIndex] ?? 0)}
                                </span>
                            </span>
                        )
                    })}
                </div>
            )}

            {showLegend && (
                <div
                    style={{
                        marginTop: '8px',
                        display: 'flex',
                        gap: '14px',
                        flexWrap: 'wrap',
                    }}
                >
                    {series.map((s, idx) => {
                        const color =
                            s.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length]!
                        return (
                            <span
                                key={idx}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '12px',
                                    color: 'var(--ds-color-foreground-secondary)',
                                }}
                            >
                                <span
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        background: color,
                                        borderRadius: '2px',
                                    }}
                                />
                                {s.label}
                            </span>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
