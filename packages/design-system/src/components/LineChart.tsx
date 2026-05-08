import { useId, useState, type CSSProperties } from 'react'
import {
    chartDefaults,
    niceMax,
    smoothPath,
    tooltipBoxStyle,
    type ChartPoint,
    type CommonChartProps,
} from './chartUtils.js'

export type LineChartProps = CommonChartProps & {
    fill?: boolean
    smooth?: boolean
    showDots?: boolean
    dashed?: boolean
    lineWidth?: number
    /** 점 위에 값 표시. */
    showValueOnDot?: boolean
    /** Y축 라벨 위치. */
    yAxisPosition?: 'left' | 'right' | 'none'
    /** X축 라벨 표시. */
    showXAxis?: boolean
    /** 수평 기준선 (목표/평균 등). */
    referenceLine?: { value: number; label?: string; color?: string }
    /** 동시에 비교할 보조 시리즈. */
    compareData?: ChartPoint[]
    compareColor?: string
    compareLabel?: string
}

const { padding, gridColor, labelColor, color: defaultColor } = chartDefaults

export const LineChart = ({
    data,
    height = 240,
    showGrid = true,
    showLabels = true,
    color = defaultColor,
    fill = true,
    smooth = true,
    showDots = true,
    dashed = false,
    lineWidth = 2.5,
    showValueOnDot = false,
    yAxisPosition = 'left',
    showXAxis = true,
    referenceLine,
    compareData,
    compareColor = 'var(--ds-palette-primary-300)',
    compareLabel,
    formatValue = (n) => String(n),
    interactive = true,
    style,
}: LineChartProps) => {
    const id = useId().replace(/:/g, '')
    const width = 600
    const allValues = compareData
        ? [...data.map((d) => d.value), ...compareData.map((d) => d.value)]
        : data.map((d) => d.value)
    const max = niceMax(Math.max(...allValues, referenceLine?.value ?? 0))
    const padLeft = yAxisPosition === 'left' ? padding.left : 16
    const padRight = yAxisPosition === 'right' ? padding.left : padding.right
    const w = width - padLeft - padRight
    const h = height - padding.top - padding.bottom
    const [hover, setHover] = useState<number | null>(null)
    const [mouseX, setMouseX] = useState<number>(0)

    const px = (i: number) =>
        data.length === 1
            ? padLeft + w / 2
            : padLeft + (i / (data.length - 1)) * w
    const py = (v: number) =>
        padding.top + h - (max === 0 ? 0 : (v / max) * h)

    const buildPath = (values: number[]): string => {
        const points: [number, number][] = values.map((v, i) => [px(i), py(v)])
        return smooth
            ? smoothPath(points)
            : points
                  .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`)
                  .join(' ')
    }

    const linePath = buildPath(data.map((d) => d.value))
    const comparePath = compareData
        ? buildPath(compareData.map((d) => d.value))
        : ''
    const lastPoint = data.length > 0 ? data[data.length - 1] : null
    const firstPoint = data.length > 0 ? data[0] : null
    const areaPath =
        data.length > 1 && firstPoint && lastPoint
            ? `${linePath} L${px(data.length - 1)},${padding.top + h} L${px(0)},${padding.top + h} Z`
            : ''

    const ticks = 4
    const tickValues = Array.from({ length: ticks + 1 }, (_, i) =>
        Math.round((max / ticks) * i),
    )

    const onMove = (e: React.MouseEvent<SVGRectElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const xRatio = (e.clientX - rect.left) / rect.width
        const xPx = xRatio * width - padLeft
        const i = Math.round((xPx / w) * Math.max(data.length - 1, 1))
        const clamped = Math.max(0, Math.min(data.length - 1, i))
        setHover(clamped)
        setMouseX((px(clamped) / width) * rect.width)
    }

    const yLabelX = yAxisPosition === 'right' ? padLeft + w + 8 : padLeft - 8
    const yLabelAnchor = yAxisPosition === 'right' ? 'start' : 'end'

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
                    <linearGradient
                        id={`fill-${id}`}
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                    >
                        <stop offset="0%" stopColor={color} stopOpacity="0.32" />
                        <stop offset="50%" stopColor={color} stopOpacity="0.10" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {showGrid &&
                    tickValues.map((t, idx) => {
                        const y = py(t)
                        return (
                            <g key={t}>
                                <line
                                    x1={padLeft}
                                    x2={padLeft + w}
                                    y1={y}
                                    y2={y}
                                    stroke={gridColor}
                                    strokeWidth={idx === 0 ? 1 : 0.5}
                                    strokeDasharray={idx === 0 ? '0' : '2 4'}
                                    opacity={idx === 0 ? 0.6 : 0.5}
                                />
                                {showLabels && yAxisPosition !== 'none' && (
                                    <text
                                        x={yLabelX}
                                        y={y + 3}
                                        textAnchor={yLabelAnchor}
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
                            x1={padLeft}
                            x2={padLeft + w}
                            y1={py(referenceLine.value)}
                            y2={py(referenceLine.value)}
                            stroke={
                                referenceLine.color ??
                                'var(--ds-color-state-warning)'
                            }
                            strokeWidth="1.5"
                            strokeDasharray="5 4"
                        />
                        {referenceLine.label && (
                            <text
                                x={padLeft + w - 4}
                                y={py(referenceLine.value) - 4}
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

                {fill && data.length > 1 && (
                    <path d={areaPath} fill={`url(#fill-${id})`} />
                )}

                {compareData && (
                    <path
                        d={comparePath}
                        fill="none"
                        stroke={compareColor}
                        strokeWidth={lineWidth}
                        strokeDasharray="4 4"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        opacity={0.7}
                    />
                )}

                <path
                    d={linePath}
                    fill="none"
                    stroke={color}
                    strokeWidth={lineWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeDasharray={dashed ? '6 4' : undefined}
                />

                {hover !== null && interactive && (
                    <line
                        x1={px(hover)}
                        x2={px(hover)}
                        y1={padding.top}
                        y2={padding.top + h}
                        stroke={color}
                        strokeWidth="1"
                        strokeDasharray="3 3"
                        opacity="0.5"
                    />
                )}

                {showDots &&
                    data.map((d, i) => {
                        const isHover = hover === i && interactive
                        return (
                            <g key={i}>
                                {isHover && (
                                    <circle
                                        cx={px(i)}
                                        cy={py(d.value)}
                                        r={9}
                                        fill={color}
                                        opacity="0.18"
                                    />
                                )}
                                <circle
                                    cx={px(i)}
                                    cy={py(d.value)}
                                    r={isHover ? 4.5 : 3.5}
                                    fill="var(--ds-color-background-page)"
                                    stroke={color}
                                    strokeWidth={isHover ? 2.5 : 2}
                                    style={{
                                        transition:
                                            'r 160ms ease, stroke-width 160ms ease',
                                    }}
                                />
                            </g>
                        )
                    })}

                {showValueOnDot &&
                    data.map((d, i) => (
                        <text
                            key={`v-${i}`}
                            x={px(i)}
                            y={py(d.value) - 10}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="700"
                            fill={color}
                            fontFamily='"JetBrains Mono", monospace'
                        >
                            {formatValue(d.value)}
                        </text>
                    ))}

                {showLabels &&
                    showXAxis &&
                    data.map((d, i) => (
                        <text
                            key={`x-${i}`}
                            x={px(i)}
                            y={height - 10}
                            textAnchor="middle"
                            fontSize="10"
                            fill={labelColor}
                            fontFamily='"JetBrains Mono", monospace'
                        >
                            {d.label}
                        </text>
                    ))}

                {interactive && (
                    <rect
                        x={padLeft}
                        y={padding.top}
                        width={w}
                        height={h}
                        fill="transparent"
                        onMouseMove={onMove}
                        onMouseLeave={() => setHover(null)}
                    />
                )}
            </svg>
            {interactive && hover !== null && data[hover] && (
                <div
                    style={{
                        position: 'absolute',
                        left: `${mouseX}px`,
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
                    {compareData && compareData[hover] && (
                        <span
                            style={{
                                opacity: 0.7,
                                fontSize: '11px',
                                fontFamily:
                                    'var(--ds-typography-fontFamily-mono)',
                            }}
                        >
                            {compareLabel ?? '비교'}:{' '}
                            {formatValue(compareData[hover].value)}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
