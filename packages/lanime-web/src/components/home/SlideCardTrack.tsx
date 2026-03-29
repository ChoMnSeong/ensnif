import styled from '@emotion/styled'
import SlideCard from '@components/home/SlideCard'
import SlideCardSkeleton from '@components/home/SlideCardSkeleton'
import { AdData } from '@libs/apis/ad/type'

interface SlideCardTrackProps {
    isImageLoading: boolean
    isApiLoading: boolean
    isError: boolean
    card: AdData[]
    now: number
    onLoad: () => void
}

const SlideCardTrack: React.FC<SlideCardTrackProps> = ({
    isImageLoading,
    isApiLoading,
    isError,
    card,
    now,
    onLoad,
}) => {
    return (
        <SlideCardTrackContainer cardLength={card.length || 1}>
            {!isApiLoading &&
                !isError &&
                card.map((el: AdData, index: number) => (
                    <SlideCard
                        key={index}
                        index={index}
                        slideContent={el}
                        now={now}
                        onLoad={onLoad}
                        isLoading={isApiLoading}
                    />
                ))}
            {((isImageLoading && isApiLoading) || isError) && (
                <SlideCardSkeleton key="skeleton" index={0} />
            )}
        </SlideCardTrackContainer>
    )
}

export default SlideCardTrack

const SlideCardTrackContainer = styled.div<{ cardLength: number }>`
    position: relative;
    top: 0;
    left: 0;
    margin-left: auto 0;
    width: ${({ cardLength }) => `${cardLength * 100}vw`};
    height: 100%;
`
