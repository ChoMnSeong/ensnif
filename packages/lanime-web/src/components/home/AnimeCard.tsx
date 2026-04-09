import React from 'react'
import Text from '@components/common/Text'
import Image from '@components/common/Image'
import Flex from '@components/common/Flex'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { useDispatch } from 'react-redux'
import { openModal } from '@stores/episodeModal/reducer'
import { Animation } from '@libs/apis/animations/type'
import { themedPalette } from '@libs/style/theme'

interface AnimeCardProps extends Animation {
    disableHover?: boolean
    type?: string
    genres?: string[]
    status?: string
    showDetails?: boolean
}

const AnimeCard: React.FC<AnimeCardProps> = ({
    id,
    title,
    thumbnailUrl,
    rank,
    ageRating,
    disableHover = false,
    type,
    genres,
    status,
    showDetails = false,
}) => {
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const handleCardClick = () => {
        dispatch(
            openModal({
                animationId: id,
                title: title,
            }),
        )
    }

    return (
        <AnimeCardBlock
            as="li"
            gap="1rem"
            direction="row"
            flex="0 0 var(--card-w)"
            width="var(--card-w)"
            height="100%"
            onClick={handleCardClick}
            disableHover={disableHover}
            align="center"
        >
            <ImageWrapper>
                <Image
                    src={thumbnailUrl}
                    alt={title}
                    height={'auto'}
                    width={'100%'}
                    $aspectRatio="2/3"
                    borderRadius="0.5rem"
                    loading="lazy"
                />
            </ImageWrapper>
            <AnimeCardContentBlock
                flex={1}
                padding="0.5rem 0"
                direction="column"
                justify="flex-start"
                gap="0.5rem"
            >
                {rank !== undefined && (
                    <RankNumber>{t('common.rank', { rank })}</RankNumber>
                )}
                <AnimeTitleBlock style={{ margin: '0' }}>
                    <Text
                        color={themedPalette.text1}
                        sz="mdCt"
                        weight={700}
                        style={{ display: 'contents' }}
                    >
                        {title}
                    </Text>
                </AnimeTitleBlock>

                {showDetails && (
                    <>
                        <TagsContainer gap="0.4rem">
                            {status && (
                                <Tag>{t(`animationStatus.${status}`, { defaultValue: status })}</Tag>
                            )}
                            {type && (
                                <Tag>{t(`animationType.${type}`, { defaultValue: type })}</Tag>
                            )}
                        </TagsContainer>

                        {genres && genres.length > 0 && (
                            <GenresContainer gap="0.3rem">
                                {genres.slice(0, 2).map((genre) => (
                                    <GenreTag key={genre}>
                                        {t(`genre.${genre}`, { defaultValue: genre })}
                                    </GenreTag>
                                ))}
                                {genres.length > 2 && (
                                    <GenreTag>+{genres.length - 2}</GenreTag>
                                )}
                            </GenresContainer>
                        )}
                    </>
                )}

                {ageRating !== undefined && ageRating !== null && (
                    <AgeRatingBlock margin="0.25rem 0 0 0">
                        <Text color="gray" sz="smCt">
                            {ageRating}+
                        </Text>
                    </AgeRatingBlock>
                )}
            </AnimeCardContentBlock>
        </AnimeCardBlock>
    )
}

export default AnimeCard

const AgeRatingBlock = styled(Flex)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
`

const TagsContainer = styled(Flex)`
    flex-wrap: wrap;
    gap: 0.4rem;
`

const Tag = styled.span`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${themedPalette.text2};
    background-color: ${themedPalette.bg_element2};
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    white-space: nowrap;
`

const GenresContainer = styled(Flex)`
    flex-wrap: wrap;
    gap: 0.3rem;
`

const GenreTag = styled.span`
    font-size: 0.7rem;
    font-weight: 500;
    color: ${themedPalette.text3};
    background-color: ${themedPalette.bg_element3};
    padding: 0.2rem 0.4rem;
    border-radius: 0.2rem;
    white-space: nowrap;
`

const ImageWrapper = styled.div`
    position: relative;
    flex: 0 0 40%;
    max-width: 40%;
`

const RankNumber = styled.span`
    font-size: 1.1rem;
    font-weight: 800;
    color: ${themedPalette.text2};
    line-height: 1.2;
`

const AnimeCardContentBlock = styled(Flex)`
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
`

const AnimeCardBlock = styled(Flex)<{ disableHover: boolean }>`
    scroll-snap-align: start;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 0.5rem;
    list-style: none;
    padding: 0.5rem;
    min-width: 0;

    ${({ disableHover }) =>
        !disableHover &&
        css`
            &:hover {
                background-color: ${themedPalette.bg_element1};
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transform: translateY(-4px);
            }
        `}
`

const AnimeTitleBlock = styled.div`
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    line-height: 1.4;
    height: 2.8em;

    & > span {
        display: inline;
    }
`
