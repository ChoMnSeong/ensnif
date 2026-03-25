import Text from '../common/Text'
import Image from '../common/Image'
import { statusLabelMap, typeLabelMap } from '../../libs/constants/anime'
import styled from '@emotion/styled'
import { useDispatch } from 'react-redux'
import { openModal } from '../../stores/episodeModal/reducer'
import { Animation } from '../../libs/apis/animations/type'
import { themedPalette } from '../../libs/style/theme'

const AnimeCard: React.FC<Animation> = ({
    id,
    title,
    thumbnailURL,
    type,
    ageRating,
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
            <StyledImage
                src={thumbnailURL}
                alt={title}
                height={'55.7047%'}
                width={'100%'}
            />
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

const StyledImage = styled(Image)`
    object-fit: cover;
    border-radius: 0.5rem;
`

const AnimeCardContentBlock = styled.div`
    height: 44%;
    padding-left: 0.25rem;
`

const AnimeCardBlock = styled.li`
    gap: 3%;
    flex: 0 0 18.625em;
    width: 18.625em;
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

    &:hover ${AnimeSubTiltBlock} {
        opacity: 1;
        display: block;
    }

    &:hover ${StyledImage} {
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
