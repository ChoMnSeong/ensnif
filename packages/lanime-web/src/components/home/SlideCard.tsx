import styled from '@emotion/styled'
import { AdData } from '../../libs/apis/ad/type'

interface SlideCardProps {
    isLoading: boolean
    index: number
    now: number
    slideContent: AdData
    onLoad: () => void
}

const SlideCard: React.FC<SlideCardProps> = ({
    isLoading,
    index,
    now,
    slideContent,
    onLoad,
}) => {
    const handleImageLoad = () => {
        onLoad()
    }

    return (
        <SlideBlock
            isLoading={isLoading}
            key={index}
            index={index}
            now={now}
            data-index={index}
            aria-hidden={index === now ? 'false' : 'true'}
        >
            <SlideContent slideContent={slideContent.webImageURL}>
                <SlideDetailContainer>
                    <LogoImg
                        src={slideContent.logoImageURL}
                        alt={slideContent.id}
                        onLoad={handleImageLoad}
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

const SlideContent = styled.div<{
    slideContent: string
}>`
    background-image: ${(props) => `url(${props.slideContent})`};
    background-size: cover;
    background-position: center;
    width: 100vw;
    height: 100%;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
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

const SlideDetailContainer = styled.div`
    position: relative;
    left: 3.125em;
    top: 50%;
    transform: translateY(-50%);
    max-width: 38.75em;
`

const LogoImg = styled.img`
    height: 16.25em;
    object-fit: cover;
    margin-top: 0.75em;
`
