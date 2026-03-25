import React, { useState } from 'react'
import styled from '@emotion/styled'
import Text from '../common/Text'
import { themedPalette } from '../../libs/style/theme'
import { AnimationDetail } from '../../libs/apis/animations/type'
import Flex from '../common/Flex'

const AnimePreview: React.FC<{ animation: AnimationDetail }> = ({
    animation,
}) => {
    const [expanded, setExpanded] = useState(false)

    return (
        <Container>
            <VideoWrapper>
                <ThumbnailContainer>
                    <Thumbnail
                        src={animation.thumbnailURL}
                        alt="anime preview thumbnail"
                    />
                    <ThumbnailWrapper>
                        <Title>{animation.title}</Title>
                        <TagWrapper>
                            <Flex gap="1rem" justifyContent="flex-start">
                                <Tag>{animation.status}</Tag>
                                <Tag>{animation.type}</Tag>
                                <Tag>{animation.ageRating}+</Tag>
                            </Flex>

                            <Flex gap="1rem" justifyContent="flex-start">
                                {animation.genres?.map((g) => (
                                    <Tag key={g}>{g}</Tag>
                                ))}
                            </Flex>
                        </TagWrapper>
                        <Description expanded={expanded}>
                            <AnimationPlot
                                expanded={expanded}
                                sz="smCt"
                                color={themedPalette.white}
                            >
                                {animation.description}
                            </AnimationPlot>
                            <AddButton onClick={() => setExpanded(!expanded)}>
                                <Text sz="smCt" color={themedPalette.white}>
                                    {expanded ? '접기' : '...더보기'}
                                </Text>
                            </AddButton>
                        </Description>
                    </ThumbnailWrapper>
                </ThumbnailContainer>
            </VideoWrapper>
        </Container>
    )
}

export default AnimePreview

const Container = styled.div`
    display: flex;
    justify-content: center;
`

const VideoWrapper = styled.div`
    position: relative;
    width: 100%;
    border-radius: 12px 12px 0 0;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        box-shadow: inset 0 -5rem 100px 1rem rgba(25, 27, 42, 1);
        pointer-events: none;
        z-index: 0;
    }
`

const ThumbnailContainer = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    background-color: rgb(25, 27, 42);

    /* &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.4) 40%,
            rgba(0, 0, 0, 0.7) 80%,
            rgba(0, 0, 0, 0.9) 100%
        );
        backdrop-filter: blur(8px);
        transition: all 0.3s ease;
        z-index: 0;
    } */
`

const ThumbnailWrapper = styled.div`
    z-index: 1;
    flex: 1 1 0%;
    display: flex;
    flex-direction: column;
    padding: 3rem 3rem 2rem;
    min-height: 26.8125rem;
    flex-direction: column;
    justify-content: space-between;
`

const Thumbnail = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    opacity: 0.4;
`

const Title = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    color: ${themedPalette.white};
    font-size: 2.4rem;
    font-weight: 700;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
    min-height: 12rem;
    @media (max-width: 480px) {
        font-size: 1.5rem;
    }
`

const TagWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 3rem;

    @media (max-width: 480px) {
        gap: 0.75rem;
        margin-bottom: 1.5rem;
    }
`

const Tag = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem 0.9rem;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
    color: ${themedPalette.white};
    font-size: 0.8rem;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: 0.02em;
    backdrop-filter: blur(6px);
    transition: all 0.25s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
    }

    @media (max-width: 480px) {
        font-size: 0.7rem;
        padding: 0.3rem 0.7rem;
    }
`

const Description = styled.div<{ expanded: boolean }>`
    display: flex;
    width: 100%;
    position: relative;
    align-items: flex-end;
    min-height: calc(0.875rem * 1.4 * 7);
    height: 100%;
    overflow: ${({ expanded }) => (expanded ? 'visible' : 'hidden')};
`

const AnimationPlot = styled(Text)<{ expanded: boolean }>`
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-align: left;
    white-space: pre-line;
    overflow: ${({ expanded }) => (expanded ? 'scroll' : 'hidden')};
    transition: max-height 0.5s ease;

    -webkit-line-clamp: ${({ expanded }) => (expanded ? 'unset' : 2)};
    max-height: ${({ expanded }) =>
        expanded ? 'calc(0.875rem * 1.4 * 7);' : '2.5rem'};

    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
`

const AddButton = styled.button`
    position: absolute;
    right: 0px;
    text-align: right;
    font-weight: 500;
    padding-left: 2rem;
    margin-left: -5.25rem;
    cursor: pointer;
    border: none;
    color: ${themedPalette.white};
    font-size: 0.875rem;
    background-color: transparent;

    &:hover {
        opacity: 0.8;
    }
`
