import type { CSSProperties } from 'react'

export type ChartPoint = { label: string; value: number }

export const chartDefaults = {
    color: 'var(--ds-palette-primary-500)',
    gridColor: 'var(--ds-color-border-subtle)',
    labelColor: 'var(--ds-color-foreground-tertiary)',
    padding: { top: 20, right: 20, bottom: 32, left: 40 },
}

export const niceMax = (max: number): number => {
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

export const smoothPath = (
    points: [number, number][],
    tension = 0.5,
): string => {
    if (points.length === 0) return ''
    if (points.length === 1) return `M ${points[0]![0]} ${points[0]![1]}`
    let path = `M ${points[0]![0]} ${points[0]![1]}`
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] ?? points[i]!
        const p1 = points[i]!
        const p2 = points[i + 1]!
        const p3 = points[i + 2] ?? p2
        const cp1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension
        const cp1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension
        const cp2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension
        const cp2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension
        path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0]} ${p2[1]}`
    }
    return path
}

export const tooltipBoxStyle: CSSProperties = {
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
}

export type CommonChartProps = {
    data: ChartPoint[]
    height?: number
    showGrid?: boolean
    showLabels?: boolean
    color?: string
    formatValue?: (n: number) => string
    interactive?: boolean
    style?: CSSProperties
}
