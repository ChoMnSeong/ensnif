import React from 'react'
import styled from '@emotion/styled'

interface ImageProps {
    src: string
    alt: string
    webpSrc?: string
    width?: string | number
    height?: string | number
    borderRadius?: string
    border?: string
    loading?: 'lazy' | 'eager'
    fetchPriority?: 'high' | 'low' | 'auto'
    $aspectRatio?: string
}

const Image: React.FC<ImageProps> = (props) => {
    return (
        <picture>
            {props.webpSrc && (
                <source srcSet={props.webpSrc} type="image/webp" />
            )}
            <Img {...props} />
        </picture>
    )
}

export default Image

const Img = styled.img<Omit<ImageProps, 'src' | 'alt' | 'webpSrc'>>`
    display: block;
    width: ${({ width }) =>
        typeof width === 'number' ? `${width}px` : width || '24px'};

    height: ${({ height }) =>
        typeof height === 'number' ? `${height}px` : height || '24px'};

    border-radius: ${({ borderRadius }) => borderRadius || '0'};

    border: ${({ border }) => border || 'none'};

    aspect-ratio: ${({ $aspectRatio }) => $aspectRatio ?? 'auto'};

    object-fit: cover;
    overflow: hidden;
`
