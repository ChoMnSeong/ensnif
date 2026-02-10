import React from 'react'
import styled from '@emotion/styled'

interface ImageProps {
    src: string
    alt: string
    webpSrc?: string
    width?: string | number
    height?: string | number
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

const Img = styled.img<{ width?: string | number; height?: string | number }>`
    display: block;
    height: auto;
    width: ${({ width }) =>
        typeof width === 'number' ? `${width}px` : width || '24px'};
    height: ${({ height }) =>
        typeof height === 'number' ? `${height}px` : height || '24px'};
`
