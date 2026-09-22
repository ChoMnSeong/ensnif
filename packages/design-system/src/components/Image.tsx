import {
    useState,
    type CSSProperties,
    type ImgHTMLAttributes,
    type ReactNode,
    type Ref,
} from 'react'
import { mergeStyles } from './types.js'

export type ImageProps = {
    src: string
    alt?: string
    width?: number | string
    height?: number | string
    aspectRatio?: number | string
    fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    radius?: string
    fallback?: ReactNode
    placeholder?: ReactNode
    /** 기본 'lazy'. 첫 화면에 보이는 이미지에만 'eager' 를 준다. */
    loading?: 'lazy' | 'eager'
    ref?: Ref<HTMLDivElement>
} & Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'width' | 'height' | 'src' | 'alt' | 'loading'
>

const dim = (v: number | string | undefined) =>
    v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v

export const Image = ({
    src,
    alt = '',
    width,
    height,
    aspectRatio,
    fit = 'cover',
    radius,
    fallback,
    placeholder,
    loading = 'lazy',
    style,
    ref,
    ...rest
}: ImageProps) => {
    const [loaded, setLoaded] = useState(false)
    const [errored, setErrored] = useState(false)
    // 숫자 크기는 HTML 속성으로도 넘긴다. 브라우저가 로드 전에 자리를 잡아 CLS 를 막는다.
    const intrinsicWidth = typeof width === 'number' ? width : undefined
    const intrinsicHeight = typeof height === 'number' ? height : undefined

    const containerStyle: CSSProperties = {
        position: 'relative',
        width: dim(width),
        height: dim(height),
        aspectRatio: aspectRatio !== undefined ? String(aspectRatio) : undefined,
        background: 'var(--ds-color-background-inset)',
        borderRadius: radius,
        overflow: 'hidden',
        display: 'inline-block',
    }

    if (errored) {
        return (
            <div
                ref={ref}
                style={mergeStyles(containerStyle, style)}
                aria-label={alt}
            >
                {fallback ?? (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--ds-color-foreground-muted)',
                            fontSize: '11px',
                        }}
                    >
                        이미지 없음
                    </div>
                )}
            </div>
        )
    }

    return (
        <div ref={ref} style={mergeStyles(containerStyle, style)}>
            {!loaded && placeholder && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {placeholder}
                </div>
            )}
            <img
                src={src}
                alt={alt}
                width={intrinsicWidth}
                height={intrinsicHeight}
                loading={loading}
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={() => setErrored(true)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: fit,
                    display: 'block',
                    opacity: loaded ? 1 : 0,
                    transition: 'opacity 200ms ease',
                }}
                {...rest}
            />
        </div>
    )
}
