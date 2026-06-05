import type { CSSProperties } from 'react'
import { cardFace } from '../lib/format'
import type { CardSize, CardViewProps } from './props'

interface SizeSpec {
    width: number
    height: number
    corner: number
    center: number
    radius: string
}

const SIZES: Record<CardSize, SizeSpec> = {
    sm: { width: 30, height: 42, corner: 9, center: 16, radius: 'var(--ds-radius-xs)' },
    md: { width: 44, height: 62, corner: 12, center: 24, radius: 'var(--ds-radius-sm)' },
    lg: { width: 56, height: 80, corner: 15, center: 31, radius: 'var(--ds-radius-sm)' },
}

const RED = '#d23b3b'
const INK = '#1a1a1a'

/** Renders a single playing card, face-up or face-down. */
export function CardView({ card, size = 'md', hidden = false, dimmed = false }: CardViewProps) {
    const spec = SIZES[size]

    const base: CSSProperties = {
        width: spec.width,
        height: spec.height,
        borderRadius: spec.radius,
        boxSizing: 'border-box',
        flexShrink: 0,
        userSelect: 'none',
        opacity: dimmed ? 0.45 : 1,
        transition: 'opacity 120ms ease',
    }

    const faceDown = card === null || hidden

    if (faceDown) {
        const backStyle: CSSProperties = {
            ...base,
            border: '1px solid var(--ds-color-border-strong)',
            background:
                'repeating-linear-gradient(45deg, #16324a 0, #16324a 4px, #123b32 4px, #123b32 8px)',
            boxShadow: 'var(--ds-shadow-sm)',
        }
        return <div style={backStyle} aria-hidden="true" />
    }

    const face = cardFace(card)
    const color = face.red ? RED : INK

    const faceStyle: CSSProperties = {
        ...base,
        position: 'relative',
        background: '#fdfdfb',
        border: '1px solid var(--ds-color-border-default)',
        boxShadow: 'var(--ds-shadow-sm)',
        color,
    }

    const cornerStyle: CSSProperties = {
        position: 'absolute',
        top: 2,
        left: 4,
        fontSize: spec.corner,
        fontWeight: 700,
        lineHeight: 1,
    }

    const centerStyle: CSSProperties = {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: spec.center,
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: '-0.02em',
    }

    return (
        <div style={faceStyle} aria-label={`${face.rank}${face.suit}`} role="img">
            <span style={cornerStyle}>{face.rank}</span>
            <span style={centerStyle}>
                {face.rank}
                {face.suit}
            </span>
        </div>
    )
}
