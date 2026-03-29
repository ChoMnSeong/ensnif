import Text from '@components/common/Text'
import Image from '@components/common/Image'
import Flex from '@components/common/Flex'
import { statusLabelMap, typeLabelMap } from '@libs/constants/anime'
import styled from '@emotion/styled'
import { useDispatch } from 'react-redux'
import { openModal } from '@stores/episodeModal/reducer'
import { Animation } from '@libs/apis/animations/type'
import { themedPalette } from '@libs/style/theme'

const AnimeCard: React.FC<Animation> = ({
    id,
    title,
    thumbnailUrl,
    type,
    ageRating,
    rank,
}) => {
    const dispatch = useDispatch()

    const handleCardClick = () => {
        dispatch(
            openModal({
                animationId: id,
                title: title,
            }),
        )
    }

    return (
        <AnimeCardBlock onClick={handleCardClick}>
            <ImageWrapper>
                <Image
                    src={thumbnailUrl}
                    alt={title}
                    height={'auto'}
                    width={'100%'}
                    $aspectRatio="100/55.7047"
                    borderRadius="0.5rem"
                    loading="lazy"
                />
                {rank !== undefined && (
                    <RankBadge
                        alignItems="baseline"
                        justifyContent="flex-start"
                        gap="0.15rem"
                    >
                        <RankNumber>{rank}</RankNumber>
                        <Text
                            sz="smCt"
                            color="rgba(255,255,255,0.85)"
                            weight={700}
                        >
                            위
                        </Text>
                    </RankBadge>
                )}
            </ImageWrapper>
            <AnimeCardContentBlock>
                <AnimeTitleBlock>
                    <Text color={themedPalette.text1} sz="mdCt">
                        {title}
                    </Text>
                </AnimeTitleBlock>
                <AnimeSubTiltBlock>
                    <Text color="gray" sz="smCt">
                        {typeLabelMap[type]} | {statusLabelMap['airing']}
                        {` | ${ageRating}`}
                    </Text>
                </AnimeSubTiltBlock>
            </AnimeCardContentBlock>
        </AnimeCardBlock>
    )
}

export default AnimeCard

const AnimeSubTiltBlock = styled.div`
    margin-top: 0.1rem;
    opacity: 0;
    display: none;
    transition: opacity 0.3s ease;
`

const ImageWrapper = styled.div`
    position: relative;
`

const RankBadge = styled(Flex)`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.5rem 0.5rem 0.4rem;
    background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.75) 0%,
        transparent 100%
    );
    border-radius: 0 0 0.5rem 0.5rem;
    pointer-events: none;
`

const RankNumber = styled.span`
    font-size: 1.75rem;
    font-weight: 900;
    color: white;
    line-height: 1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`

const AnimeCardContentBlock = styled.div`
    height: 44%;
    padding-left: 0.25rem;
`

const AnimeCardBlock = styled.li`
    gap: 3%;
    flex: 0 0 var(--card-w);
    width: var(--card-w);
    scroll-snap-align: start;
    position: relative;
    cursor: pointer;
    height: 100%;
    transition: all 0.3s ease;
    border-radius: 0.25rem;
    list-style-type: none;
    list-style: none;

    &:hover {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        transform: scale(1.25);
    }

    @media (max-width: 1023px) {
        &:hover {
            transform: scale(1.1);
        }
    }

    &:hover ${AnimeSubTiltBlock} {
        opacity: 1;
        display: block;
    }

    &:hover ${ImageWrapper} Image {
        border-radius: 0.5rem 0.5rem 0 0;
    }

    &:hover ${AnimeCardContentBlock} {
        height: 50%;
        padding: 0.4rem;
    }
`

const AnimeTitleBlock = styled.div`
    margin-top: 0.25rem;
`
