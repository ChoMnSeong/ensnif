import { useId, type CSSProperties, type ReactNode } from 'react'

export type RadarSeries = {
    label: string
    values: number[]
    color?: string
}

export type RadarChartProps = {
    axes: string[]
    series: RadarSeries[]
    size?: number
    max?: number
    levels?: number
    showLegend?: boolean
    /** 폴리곤 영역 채움 (기본 true). false면 라인만. */
    fill?: boolean
    /** 데이터 포인트 점 표시 (기본 true). */
    showDots?: boolean
    /** 그리드 모양: polygon(다각형) / circle(동심원) / none. */
    gridShape?: 'polygon' | 'circle' | 'none'
    /** 그리드 다각형 안쪽을 옅게 채움. */
    gridFilled?: boolean
    /** 축 라벨 커스텀 렌더 (값 등 추가 표시 가능). */
    axisLabelRender?: (axis: string, idx: number) => ReactNode
    fillOpacity?: number
    style?: CSSProperties
}

const DEFAULT_COLORS = [
    'var(--ds-palette-primary-500)',
    'var(--ds-palette-primary-700)',
    'var(--ds-palette-primary-300)',
    'var(--ds-palette-primary-400)',
]

const polar = (cx: number, cy: number, r: number, deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const
}

export const RadarChart = ({
    axes,
    series,
    size = 280,
    max,
    levels = 4,
    showLegend = true,
    fill = true,
    showDots = true,
    gridShape = 'polygon',
    gridFilled = false,
    axisLabelRender,
    fillOpacity = 0.22,
    style,
}: RadarChartProps) => {
    const id = useId().replace(/:/g, '')
    const cx = size / 2
    const cy = size / 2
    const padding = 48
    const radius = size / 2 - padding
    const allValues = series.flatMap((s) => s.values)
    const computedMax = max ?? Math.max(...allValues, 1)
    const angleStep = 360 / Math.max(axes.length, 1)

    const axisPoint = (axisIdx: number, frac: number) => {
        const deg = axisIdx * angleStep
        return polar(cx, cy, radius * frac, deg)
    }

    const polygonPath = (frac: number): string =>
        axes
            .map((_, ai) => {
                const [x, y] = axisPoint(ai, frac)
                return `${ai === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
            })
            .join(' ') + ' Z'

    const seriesPath = (values: number[]): string =>
        values
            .map((v, i) => {
                const [x, y] = axisPoint(i, v / computedMax)
                return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
            })
            .join(' ') + ' Z'

    return (
        <div style={{ display: 'inline-block', ...style }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{ display: 'block' }}
            >
                {gridShape !== 'none' &&
                    Array.from({ length: levels }, (_, i) => {
                        const frac = (i + 1) / levels
                        if (gridShape === 'circle') {
                            return (
                                <circle
                                    key={`grid-${id}-${i}`}
                                    cx={cx}
                                    cy={cy}
                                    r={radius * frac}
                                    fill={
                                        gridFilled
                                            ? 'var(--ds-palette-primary-500)'
                                            : 'none'
                                    }
                                    fillOpacity={
                                        gridFilled
                                            ? 0.04 + (1 - frac) * 0.05
                                            : 0
                                    }
                                    stroke="var(--ds-color-border-subtle)"
                                    strokeWidth="1"
                                />
                            )
                        }
                        return (
                            <path
                                key={`grid-${id}-${i}`}
                                d={polygonPath(frac)}
                                fill={
                                    gridFilled
                                        ? 'var(--ds-palette-primary-500)'
                                        : 'none'
                                }
                                fillOpacity={
                                    gridFilled
                                        ? 0.04 + (1 - frac) * 0.05
                                        : 0
                                }
                                stroke="var(--ds-color-border-subtle)"
                                strokeWidth="1"
                            />
                        )
                    })}

                {gridShape !== 'none' &&
                    axes.map((_, i) => {
                        const [x, y] = axisPoint(i, 1)
                        return (
                            <line
                                key={`axis-${id}-${i}`}
                                x1={cx}
                                y1={cy}
                                x2={x}
                                y2={y}
                                stroke="var(--ds-color-border-subtle)"
                                strokeWidth="1"
                            />
                        )
                    })}

                {axes.map((label, i) => {
                    const [x, y] = axisPoint(i, 1.18)
                    const rendered = axisLabelRender
                        ? axisLabelRender(label, i)
                        : label
                    if (typeof rendered === 'string') {
                        return (
                            <text
                                key={`label-${id}-${i}`}
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="11"
                                fill="var(--ds-color-foreground-secondary)"
                                fontFamily="inherit"
                                fontWeight="600"
                            >
                                {rendered}
                            </text>
                        )
                    }
                    return (
                        <foreignObject
                            key={`label-${id}-${i}`}
                            x={x - 60}
                            y={y - 18}
                            width={120}
                            height={36}
                            style={{ overflow: 'visible' }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    color: 'var(--ds-color-foreground-secondary)',
                                    fontWeight: 600,
                                    textAlign: 'center',
                                    lineHeight: 1.2,
                                }}
                            >
                                {rendered}
                            </div>
                        </foreignObject>
                    )
                })}

                {series.map((s, idx) => {
                    const color =
                        s.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length]!
                    return (
                        <g key={`s-${id}-${idx}`}>
                            <path
                                d={seriesPath(s.values)}
                                fill={fill ? color : 'none'}
                                fillOpacity={fill ? fillOpacity : 0}
                                stroke={color}
                                strokeWidth="2"
                                strokeLinejoin="round"
                            />
                            {showDots &&
                                s.values.map((v, i) => {
                                    const [px, py] = axisPoint(
                                        i,
                                        v / computedMax,
                                    )
                                    return (
                                        <circle
                                            key={i}
                                            cx={px}
                                            cy={py}
                                            r="3.5"
                                            fill="var(--ds-color-background-page)"
                                            stroke={color}
                                            strokeWidth="2"
                                        />
                                    )
                                })}
                        </g>
                    )
                })}
            </svg>
            {showLegend && (
                <div
                    style={{
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap',
                        marginTop: '8px',
                        justifyContent: 'center',
                    }}
                >
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
                                    fontSize: '12px',
                                    color: 'var(--ds-color-foreground-secondary)',
                                }}
                            >
                                <span
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        background: color,
                                        borderRadius: '50%',
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
