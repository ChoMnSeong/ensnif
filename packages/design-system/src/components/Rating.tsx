import { useId, useState, type CSSProperties, type MouseEvent } from 'react'
import { mergeStyles } from './types.js'

export type RatingProps = {
    value?: number
    defaultValue?: number
    onChange?: (value: number) => void
    max?: number
    size?: 'sm' | 'md' | 'lg'
    readOnly?: boolean
    allowClear?: boolean
    /** Allow 0.5 step ratings via left/right half click. */
    allowHalf?: boolean
    color?: string
    style?: CSSProperties
}

const sizes = { sm: 14, md: 18, lg: 24 }

const STAR_PATH =
    'M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z'

const Star = ({
    fill,
    size,
    color,
    gradientId,
}: {
    fill: 'full' | 'half' | 'empty'
    size: number
    color: string
    gradientId: string
}) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        style={{ display: 'block' }}
    >
        {fill === 'half' && (
            <defs>
                <linearGradient
                    id={gradientId}
                    x1="0"
                    x2="1"
                    y1="0"
                    y2="0"
                >
                    <stop offset="50%" stopColor={color} />
                    <stop offset="50%" stopColor="transparent" />
                </linearGradient>
            </defs>
        )}
        <path
            d={STAR_PATH}
            fill={
                fill === 'full'
                    ? color
                    : fill === 'half'
                      ? `url(#${gradientId})`
                      : 'transparent'
            }
            stroke={color}
            strokeWidth="1.4"
            strokeLinejoin="round"
        />
    </svg>
)

export const Rating = ({
    value: controlled,
    defaultValue = 0,
    onChange,
    max = 5,
    size = 'md',
    readOnly,
    allowClear = true,
    allowHalf = false,
    color = 'var(--ds-palette-primary-500)',
    style,
}: RatingProps) => {
    const id = useId().replace(/:/g, '')
    const [internal, setInternal] = useState(defaultValue)
    const value = controlled ?? internal
    const [hover, setHover] = useState<number | null>(null)
    const display = hover ?? value
    const dim = sizes[size]

    const set = (n: number) => {
        if (readOnly) return
        const next = allowClear && n === value ? 0 : n
        if (controlled === undefined) setInternal(next)
        onChange?.(next)
    }

    const computeStarValue = (
        starIdx: number,
        e: MouseEvent<HTMLButtonElement>,
    ): number => {
        if (!allowHalf) return starIdx + 1
        const rect = e.currentTarget.getBoundingClientRect()
        const xRatio = (e.clientX - rect.left) / rect.width
        return starIdx + (xRatio < 0.5 ? 0.5 : 1)
    }

    return (
        <div
            role="radiogroup"
            aria-label="Rating"
            style={mergeStyles(
                {
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                },
                style,
            )}
        >
            {Array.from({ length: max }, (_, i) => {
                const fillState: 'full' | 'half' | 'empty' =
                    display >= i + 1
                        ? 'full'
                        : display >= i + 0.5
                          ? 'half'
                          : 'empty'
                const isHover =
                    hover !== null &&
                    Math.ceil(hover) === i + 1 &&
                    !readOnly
                return (
                    <button
                        key={i}
                        type="button"
                        disabled={readOnly}
                        onClick={(e) => set(computeStarValue(i, e))}
                        onMouseMove={(e) => {
                            if (!readOnly)
                                setHover(computeStarValue(i, e))
                        }}
                        onMouseLeave={() => !readOnly && setHover(null)}
                        aria-label={`${i + 1} star${i > 0 ? 's' : ''}`}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                            cursor: readOnly ? 'default' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color,
                            transition: 'transform 100ms ease',
                            transform: isHover ? 'scale(1.1)' : 'none',
                        }}
                    >
                        <Star
                            fill={fillState}
                            size={dim}
                            color={color}
                            gradientId={`half-${id}-${i}`}
                        />
                    </button>
                )
            })}
        </div>
    )
}
