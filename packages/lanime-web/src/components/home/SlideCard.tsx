import { useCallback, useRef } from 'react'
import styled from '@emotion/styled'
import { AdListResponse } from '@libs/apis/ad/type'

interface SlideCardProps {
    isLoading: boolean
    index: number
    now: number
    slideContent: AdListResponse
    onLoad: () => void
}

const SlideCard: React.FC<SlideCardProps> = ({
    isLoading,
    index,
    now,
    slideContent,
    onLoad,
}) => {
    const onLoadRef = useRef(onLoad)
    onLoadRef.current = onLoad

    const handleImageLoad = () => {
        onLoad()
    }

    const AdBannerImageRef = useCallback(
        (img: HTMLImageElement | null) => {
            if (!img || index !== 0) return
            if (img.complete && img.naturalWidth > 0) {
                onLoadRef.current()
            }
        },
        [index],
    )

    return (
        <SlideBlock
            isLoading={isLoading}
            key={index}
            index={index}
            now={now}
            data-index={index}
            aria-hidden={index === now ? 'false' : 'true'}
        >
            <SlideContent>
                <AdBannerImage
                    ref={index === 0 ? AdBannerImageRef : undefined}
                    src={slideContent.webImageURL}
                    alt=""
                    width={1920}
                    height={1080}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding={index === 0 ? 'sync' : 'async'}
                    sizes="100vw"
                    onLoad={index === 0 ? handleImageLoad : undefined}
                />
                <SlideDetailContainer>
                    <LogoImg
                        src={slideContent.logoImageURL}
                        alt={slideContent.id}
                        width="auto"
                    />
                </SlideDetailContainer>
            </SlideContent>
        </SlideBlock>
    )
}

export default SlideCard

const SlideBlock = styled.div<{
    index: number
    now: number
    isLoading: boolean
}>`
    outline: none;
    width: 100vw;
    height: 100%;
    float: left;
    position: relative;
    left: ${(props) => `${props.index * -100}vw`};
    opacity: ${(props) => (props.index === props.now ? 1 : 0)};
    z-index: ${(props) => (props.index === props.now ? -1 : '')};
    transition: ${(props) =>
        props.index === props.now ? '' : 'opacity 500ms, visibility 500ms'};
    visibility: ${(props) => (props.isLoading ? 'hidden' : 'visible')};
`

const SlideContent = styled.div`
    width: 100vw;
    height: 100%;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 1;
        background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.6) 0%,
            rgba(0, 0, 0, 0) 30%,
            rgba(0, 0, 0, 0) 70%,
            rgba(0, 0, 0, 0.6) 100%
        );
        pointer-events: none;
    }
`

const AdBannerImage = styled.img`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 0;
`

const SlideDetailContainer = styled.div`
    position: relative;
    z-index: 2;
    left: 3.125em;
    top: 50%;
    transform: translateY(-50%);
    max-width: 38.75em;
`

const LogoImg = styled.img`
    height: 16.25em;
    width: auto;
    object-fit: cover;
    margin-top: 0.75em;
`
