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

// Omit의 제네릭 타입을 교정했습니다.
const Img = styled.img<Omit<ImageProps, 'src' | 'alt' | 'webpSrc'>>`
    display: block;
    width: ${({ width }) =>
        typeof width === 'number' ? `${width}px` : width || '24px'};

    height: ${({ height }) =>
        typeof height === 'number' ? `${height}px` : height || '24px'};

    border-radius: ${({ borderRadius }) => borderRadius || '0'};

    border: ${({ border }) => border || 'none'};

    object-fit: cover;
    overflow: hidden;
`
