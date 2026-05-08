import { useId, useState, type CSSProperties } from 'react'

export type PieDatum = { label: string; value: number; color?: string }

export type PieChartProps = {
    data: PieDatum[]
    size?: number
    donut?: boolean
    thickness?: number
    showLegend?: boolean
    /** 슬라이스 사이 각도 갭(도). 기본 0. */
    padAngle?: number
    /** 시작 각도(도). 기본 0 = 12시. */
    startAngle?: number
    /** 슬라이스 위에 % 표시. */
    showValueOnSlice?: boolean
    formatValue?: (n: number, total: number) => string
    style?: CSSProperties
}

const DEFAULT_COLORS = [
    'var(--ds-palette-primary-700)',
    'var(--ds-palette-primary-600)',
    'var(--ds-palette-primary-500)',
    'var(--ds-palette-primary-400)',
    'var(--ds-palette-primary-300)',
    'var(--ds-palette-primary-200)',
    'var(--ds-palette-primary-100)',
]

const polar = (cx: number, cy: number, r: number, deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

const arcPath = (
    cx: number,
    cy: number,
    r: number,
    startDeg: number,
    endDeg: number,
): string => {
    const [sx, sy] = polar(cx, cy, r, endDeg)
    const [ex, ey] = polar(cx, cy, r, startDeg)
    const large = endDeg - startDeg <= 180 ? 0 : 1
    return `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey} Z`
}

const donutPath = (
    cx: number,
    cy: number,
    rOuter: number,
    rInner: number,
    startDeg: number,
    endDeg: number,
): string => {
    const [osx, osy] = polar(cx, cy, rOuter, endDeg)
    const [oex, oey] = polar(cx, cy, rOuter, startDeg)
    const [isx, isy] = polar(cx, cy, rInner, startDeg)
    const [iex, iey] = polar(cx, cy, rInner, endDeg)
    const large = endDeg - startDeg <= 180 ? 0 : 1
    return `M ${osx} ${osy} A ${rOuter} ${rOuter} 0 ${large} 0 ${oex} ${oey} L ${isx} ${isy} A ${rInner} ${rInner} 0 ${large} 1 ${iex} ${iey} Z`
}

export const PieChart = ({
    data,
    size = 180,
    donut,
    thickness = 28,
    showLegend = true,
    padAngle = 0,
    startAngle = 0,
    showValueOnSlice = false,
    formatValue,
    style,
}: PieChartProps) => {
    const id = useId().replace(/:/g, '')
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1
    const [hover, setHover] = useState<number | null>(null)
    const margin = 6
    const cx = size / 2
    const cy = size / 2
    const rOuter = size / 2 - margin
    const rInner = donut ? rOuter - thickness : 0

    let cursor = 0
    const slices = data.map((d, i) => {
        const rawStart = (cursor / total) * 360
        cursor += d.value
        const rawEnd = (cursor / total) * 360
        const start = rawStart + startAngle + padAngle / 2
        const end = rawEnd + startAngle - padAngle / 2
        const safeEnd = end - start >= 360 ? start + 359.999 : end
        const path = donut
            ? donutPath(cx, cy, rOuter, rInner, start, safeEnd)
            : arcPath(cx, cy, rOuter, start, safeEnd)
        return {
            path,
            color: d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]!,
            datum: d,
            start,
            end: safeEnd,
            mid: (start + safeEnd) / 2,
            pct: (d.value / total) * 100,
        }
    })

    return (
        <div
            style={{
                display: 'inline-flex',
                gap: '20px',
                alignItems: 'center',
                ...style,
            }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{ display: 'block', overflow: 'visible' }}
            >
                {slices.map((s, i) => {
                    const isHover = hover === i
                    const rad = ((s.mid - 90) * Math.PI) / 180
                    const tx = isHover ? Math.cos(rad) * 5 : 0
                    const ty = isHover ? Math.sin(rad) * 5 : 0
                    return (
                        <path
                            key={`${id}-${i}`}
                            d={s.path}
                            fill={s.color}
                            stroke="var(--ds-color-background-page)"
                            strokeWidth="2"
                            strokeLinejoin="round"
                            opacity={
                                hover === null || isHover ? 1 : 0.55
                            }
                            transform={`translate(${tx}, ${ty})`}
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(null)}
                            style={{
                                transition:
                                    'transform 200ms ease, opacity 160ms ease',
                                cursor: 'pointer',
                                filter: isHover
                                    ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.18))'
                                    : 'none',
                            }}
                        />
                    )
                })}
                {showValueOnSlice &&
                    slices.map((s, i) => {
                        if (s.pct < 5) return null
                        const labelR = donut
                            ? (rOuter + rInner) / 2
                            : rOuter * 0.65
                        const rad = ((s.mid - 90) * Math.PI) / 180
                        const lx = cx + Math.cos(rad) * labelR
                        const ly = cy + Math.sin(rad) * labelR
                        return (
                            <text
                                key={`v-${id}-${i}`}
                                x={lx}
                                y={ly}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="11"
                                fontWeight="700"
                                fill="#ffffff"
                                fontFamily='"JetBrains Mono", monospace'
                                style={{
                                    pointerEvents: 'none',
                                    paintOrder: 'stroke',
                                    stroke: 'rgba(0,0,0,0.25)',
                                    strokeWidth: 2,
                                    strokeLinejoin: 'round',
                                }}
                            >
                                {Math.round(s.pct)}%
                            </text>
                        )
                    })}
            </svg>
            {showLegend && (
                <ul
                    style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                    }}
                >
                    {slices.map((s, i) => {
                        const isHover = hover === i
                        return (
                            <li
                                key={`${id}-l-${i}`}
                                onMouseEnter={() => setHover(i)}
                                onMouseLeave={() => setHover(null)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '12px',
                                    padding: '4px 8px',
                                    borderRadius: 'var(--ds-radius-sm)',
                                    background: isHover
                                        ? 'var(--ds-color-background-inset)'
                                        : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'background 120ms ease',
                                }}
                            >
                                <span
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '2px',
                                        background: s.color,
                                        flexShrink: 0,
                                    }}
                                />
                                <span
                                    style={{
                                        color: 'var(--ds-color-foreground-secondary)',
                                        fontWeight: isHover ? 600 : 500,
                                    }}
                                >
                                    {s.datum.label}
                                </span>
                                <span
                                    style={{
                                        color: 'var(--ds-color-foreground-primary)',
                                        fontFamily:
                                            'var(--ds-typography-fontFamily-mono)',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        marginLeft: 'auto',
                                    }}
                                >
                                    {formatValue
                                        ? formatValue(s.datum.value, total)
                                        : `${s.pct.toFixed(0)}%`}
                                </span>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export type DonutChartProps = Omit<PieChartProps, 'donut'> & {
    centerLabel?: string
    centerValue?: string
}

export const DonutChart = ({
    centerLabel,
    centerValue,
    size = 200,
    thickness = 28,
    ...rest
}: DonutChartProps) => (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
        <PieChart {...rest} donut size={size} thickness={thickness} />
        {(centerLabel || centerValue) && (
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: `${size}px`,
                    height: `${size}px`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                }}
            >
                {centerValue && (
                    <span
                        style={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: 'var(--ds-color-foreground-primary)',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {centerValue}
                    </span>
                )}
                {centerLabel && (
                    <span
                        style={{
                            fontSize: '11px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            marginTop: '2px',
                        }}
                    >
                        {centerLabel}
                    </span>
                )}
            </div>
        )}
    </div>
)
