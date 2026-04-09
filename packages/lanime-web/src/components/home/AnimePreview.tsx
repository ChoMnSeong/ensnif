import React, { useState } from 'react'
import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/react'
import Text from '@components/common/Text'
import Tag from '@components/common/Tag'
import Icon from '@components/common/Icon'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import { AnimationDetailResponse } from '@/libs/apis/animations/type'
import { useTranslation } from 'react-i18next'
import { useToggleAnimationLike } from '@libs/apis/likes'

const AnimePreview: React.FC<{ animation: AnimationDetailResponse }> = ({
    animation,
}) => {
    const [expanded, setExpanded] = useState(false)
    const { t } = useTranslation()

    const liked = animation.isFavorite ?? false
    const { mutate: toggleLike, isPending } = useToggleAnimationLike(animation.id)

    const handleLike = () => {
        if (isPending) return
        toggleLike(liked)
    }

    return (
        <Container justify="center">
            <VideoWrapper direction="row" align="stretch" $backgroundImage={animation.thumbnailUrl}>
                <PosterContainer>
                    <PosterImage
                        src={animation.thumbnailUrl}
                        alt="anime poster"
                    />
                </PosterContainer>
                <ContentWrapper direction="column" justify="space-between">
                    <TopInfo direction="column" gap="1rem">
                        <Title>{animation.title}</Title>

                        <InfoRow justify="space-between" align="center">
                            <TagsContainer>
                                <Flex direction="column" gap="0.6rem">
                                    <Flex gap="0.6rem" justify="flex-start" wrap="wrap">
                                        <Tag variant="glass" shape="pill" size="sm">
                                            {t(`animationStatus.${animation.status}`)}
                                        </Tag>
                                        <Tag variant="glass" shape="pill" size="sm">
                                            {t(`animationType.${animation.type}`)}
                                        </Tag>
                                        <Tag variant="glass" shape="pill" size="sm">
                                            {animation.ageRating}+
                                        </Tag>
                                    </Flex>
                                    <Flex gap="0.6rem" justify="flex-start" wrap="wrap">
                                        {animation.genres?.map((g) => (
                                            <Tag
                                                key={g}
                                                variant="glass"
                                                shape="pill"
                                                size="sm"
                                            >
                                                {t(`genre.${g}`, { defaultValue: g })}
                                            </Tag>
                                        ))}
                                    </Flex>
                                </Flex>
                            </TagsContainer>
                            <LikeButton
                                onClick={handleLike}
                                liked={liked}
                                aria-label={liked ? t('home.unlike') : t('home.like')}
                            >
                                <Icon
                                    name={liked ? 'favorite' : 'favoriteBorder'}
                                    size={20}
                                    color={liked ? '#ff4d6d' : 'rgba(255,255,255,0.85)'}
                                />
                                <LikeLabel liked={liked}>
                                    {liked ? t('home.unlike') : t('home.like')}
                                </LikeLabel>
                            </LikeButton>
                        </InfoRow>
                    </TopInfo>

                    <BottomInfo direction="column">
                        <TextArea expanded={expanded}>
                            <AnimationPlot sz="smCt" color={themedPalette.white}>
                                {animation.description?.split(/<br\s*\/?>/gi).map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i < (animation.description?.split(/<br\s*\/?>/gi).length ?? 0) - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </AnimationPlot>
                        </TextArea>
                        <AddButton
                            expanded={expanded}
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? t('home.less') : t('home.more')}
                        </AddButton>
                    </BottomInfo>
                </ContentWrapper>
            </VideoWrapper>
        </Container>
    )
}

export default AnimePreview

const heartPop = keyframes`
    0%   { transform: scale(1); }
    40%  { transform: scale(1.35); }
    70%  { transform: scale(0.9); }
    100% { transform: scale(1); }
`

const LikeButton = styled.button<{ liked: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 2rem;
    padding: 0.35rem 0.9rem 0.35rem 0.7rem;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;
    width: fit-content;

    &:hover {
        background: rgba(255, 255, 255, 0.22);
        border-color: rgba(255, 255, 255, 0.45);
    }

    ${({ liked }) =>
        liked &&
        css`
            background: rgba(255, 77, 109, 0.18);
            border-color: rgba(255, 77, 109, 0.5);

            svg {
                animation: ${heartPop} 0.35s ease;
            }

            &:hover {
                background: rgba(255, 77, 109, 0.28);
                border-color: rgba(255, 77, 109, 0.7);
            }
        `}
`

const LikeLabel = styled.span<{ liked: boolean }>`
    font-size: 0.8rem;
    font-weight: 600;
    color: ${({ liked }) => (liked ? '#ff4d6d' : 'rgba(255,255,255,0.85)')};
    transition: color 0.2s ease;
`

const Container = styled(Flex)``

const VideoWrapper = styled(Flex)<{ $backgroundImage: string }>`
    position: relative;
    width: 100%;
    height: 26.8125rem;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
    background-color: rgb(25, 27, 42);
    background-image: ${({ $backgroundImage }) => `url(${JSON.stringify($backgroundImage)})`};
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(25, 27, 42, 0.75);
        backdrop-filter: blur(40px);
        pointer-events: none;
        z-index: 0;
    }

    @media (max-width: 767px) {
        flex-direction: column;
        height: auto;

        &::after {
            backdrop-filter: blur(30px);
        }
    }
`

const PosterContainer = styled.div`
    flex-shrink: 0;
    width: 35%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    position: relative;
    z-index: 1;

    &::after {
        content: '';
        position: absolute;
        right: -40px;
        top: 0;
        width: 40px;
        height: 100%;
        background: linear-gradient(
            to right,
            rgba(25, 27, 42, 0.4),
            transparent
        );
        backdrop-filter: blur(20px);
        pointer-events: none;
        z-index: 1;
    }

    @media (max-width: 767px) {
        width: 100%;
        height: 300px;
        overflow: hidden;

        &::after {
            right: 0;
            width: 100%;
            height: 60px;
            top: auto;
            bottom: -60px;
            background: linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.3),
                transparent
            );
        }
    }
`

const PosterImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`

const ContentWrapper = styled(Flex)`
    flex: 1;
    padding: 2rem 2.5rem;
    position: relative;
    z-index: 2;
    overflow-y: auto;


    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            135deg,
            rgba(25, 27, 42, 0.2) 0%,
            rgba(25, 27, 42, 0.5) 100%
        );
        pointer-events: none;
        z-index: 0;
    }

    @media (max-width: 767px) {
        padding: 1.5rem;
    }
`

const TopInfo = styled(Flex)`
    width: 100%;
    flex-direction: column;
    position: relative;
    z-index: 3;
`

const InfoRow = styled(Flex)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
`

const TagsContainer = styled(Flex)`
    flex-direction: column;
    gap: 0.6rem;
    flex-wrap: wrap;
`

const Title = styled.div`
    color: ${themedPalette.white};
    font-size: 2.4rem;
    font-weight: 700;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
    max-height: 5.76rem;

    @media (max-width: 480px) {
        font-size: 1.5rem;
        max-height: 3.6rem;
    }
`

const BottomInfo = styled(Flex)`
    width: 100%;
    margin-top: auto;
    padding-top: 1rem;
    position: relative;
    z-index: 3;
`


const TextArea = styled.div<{ expanded: boolean }>`
    overflow: ${({ expanded }) => (expanded ? 'auto' : 'hidden')};
    max-height: ${({ expanded }) => (expanded ? '8rem' : '2.8rem')};
    transition: max-height 0.4s ease;

    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
`

const AnimationPlot = styled(Text)`
    display: block;
    text-align: left;
    white-space: pre-line;
    word-break: break-word;
    overflow-wrap: break-word;
    line-height: 1.6;
`

const AddButton = styled.button<{ expanded: boolean }>`
    align-self: flex-end;
    display: block;
    margin-left: auto;
    position: relative;
    z-index: 3;
    margin-top: ${({ expanded }) => (expanded ? '0.4rem' : '-1.5rem')};
    padding: 0.15rem 0.25rem 0.15rem
        ${({ expanded }) => (expanded ? '0.25rem' : '3rem')};
    border: none;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    background: ${({ expanded }) =>
        expanded
            ? 'transparent'
            : 'linear-gradient(to right, transparent, rgba(25, 27, 42, 0.9) 50%)'};
    transition:
        margin-top 0.4s ease,
        padding-left 0.4s ease,
        background 0.4s ease;

    &:hover {
        color: ${themedPalette.white};
    }
`
