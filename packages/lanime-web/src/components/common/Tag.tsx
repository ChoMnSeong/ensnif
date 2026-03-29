import React from 'react'
import styled, { CSSObject } from '@emotion/styled'
import { css } from '@emotion/react'
import { themedPalette } from '@libs/style/theme'

type TagVariant = 'primary' | 'glass'
type TagShape = 'rect' | 'circle' | 'pill'
type TagSize = 'sm' | 'md'

interface TagProps {
    children: React.ReactNode
    className?: string
    variant?: TagVariant
    shape?: TagShape
    size?: TagSize
    active?: boolean
    disabled?: boolean
    onClick?: (e: React.MouseEvent) => void
}

const Tag: React.FC<TagProps> = ({
    children,
    className,
    variant = 'primary',
    shape = 'rect',
    size = 'md',
    active = false,
    disabled = false,
    onClick,
}) => {
    const Component = onClick ? ButtonTag : DivTag

    return (
        <Component
            className={className}
            variant={variant}
            shape={shape}
            size={size}
            active={active}
            disabled={disabled}
            onClick={!disabled ? onClick : undefined}
            {...(onClick && { type: 'button' })}
        >
            {children}
        </Component>
    )
}

export default Tag

interface StyledProps {
    variant: TagVariant
    shape: TagShape
    size: TagSize
    active?: boolean
    disabled?: boolean
}

const primaryStyles = ({ active, disabled }: StyledProps) => css`
    background-color: ${active
        ? themedPalette.primary1
        : themedPalette.disabled};
    color: ${themedPalette.white};
    font-weight: 600;
    border: none;
    transition: all 0.2s ease;
    cursor: ${disabled ? 'default' : 'pointer'};

    &:hover {
        background-color: ${disabled
            ? active
                ? themedPalette.primary1
                : themedPalette.disabled
            : themedPalette.primary2};
    }
`

const glassStyles = () => css`
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: ${themedPalette.white};
    font-weight: 500;
    backdrop-filter: blur(6px);
    transition: all 0.25s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
    }
`

const sizeStyles = ({ size, shape }: StyledProps) => {
    const isCircle = shape === 'circle'

    if (size === 'md') {
        const height = '3.125rem'
        const fontSize = '1.1rem'

        return css`
            height: ${height};
            min-width: ${isCircle ? height : '5rem'};
            padding: ${isCircle ? '0' : '0 1.25rem'};
            font-size: ${fontSize};

            @media (max-width: 767px) {
                height: 2.5rem;
                min-width: ${isCircle ? '2.5rem' : '4rem'};
                font-size: 0.95rem;
            }
        `
    }

    const smHeight = '2.25rem'
    return css`
        height: ${smHeight};
        min-width: ${isCircle ? smHeight : 'auto'};
        padding: ${isCircle ? '0' : '0 1rem'};
        font-size: 0.875rem;
    `
}

const shapeStyles = ({ shape, variant }: StyledProps): CSSObject => {
    const radiusMap = {
        rect: variant === 'primary' ? '0.75rem' : '0.5rem',
        pill: '9999px',
        circle: '50%',
    }

    return {
        borderRadius: radiusMap[shape] || radiusMap.rect,
        aspectRatio: shape === 'circle' ? '1 / 1' : 'unset',
    }
}

const baseTagStyles = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    user-select: none;
    border: none;
    white-space: nowrap;
    line-height: 1;
`

const ButtonTag = styled.button<StyledProps>`
    ${baseTagStyles}
    outline: 0;
    background: none;
    ${(p) => (p.variant === 'glass' ? glassStyles() : primaryStyles(p))}
    ${(p) => sizeStyles(p)}
    ${(p) => shapeStyles(p)}
`

const DivTag = styled.div<StyledProps>`
    ${baseTagStyles}
    ${(p) => (p.variant === 'glass' ? glassStyles() : primaryStyles(p))}
    ${(p) => sizeStyles(p)}
    ${(p) => shapeStyles(p)}
`
