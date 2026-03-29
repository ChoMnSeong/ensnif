import React, { useState } from 'react'
import styled from '@emotion/styled'
import Text from '@components/common/Text'
import Tag from '@components/common/Tag'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import { AnimationDetailResponse } from '@/libs/apis/animations/type'
import { statusLabelMap, typeLabelMap } from '@/libs/constants/anime'

const AnimePreview: React.FC<{ animation: AnimationDetailResponse }> = ({
    animation,
}) => {
    const [expanded, setExpanded] = useState(false)

    return (
        <Container>
            <VideoWrapper>
                <Thumbnail
                    src={animation.thumbnailUrl}
                    alt="anime preview thumbnail"
                />

                <TopInfo>
                    <Title>{animation.title}</Title>
                    <TagWrapper>
                        <Flex gap="0.6rem" justifyContent="flex-start">
                            <Tag variant="glass" shape="pill" size="sm">
                                {statusLabelMap[animation.status]}
                            </Tag>
                            <Tag variant="glass" shape="pill" size="sm">
                                {typeLabelMap[animation.type]}
                            </Tag>
                            <Tag variant="glass" shape="pill" size="sm">
                                {animation.ageRating}+
                            </Tag>
                        </Flex>
                        <Flex gap="0.6rem" justifyContent="flex-start">
                            {animation.genres?.map((g) => (
                                <Tag
                                    key={g}
                                    variant="glass"
                                    shape="pill"
                                    size="sm"
                                >
                                    {g}
                                </Tag>
                            ))}
                        </Flex>
                    </TagWrapper>
                </TopInfo>

                <BottomInfo>
                    <TextArea expanded={expanded}>
                        <AnimationPlot sz="smCt" color={themedPalette.white}>
                            {animation.description}
                        </AnimationPlot>
                    </TextArea>
                    <AddButton
                        expanded={expanded}
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? '접기 ▲' : '더보기 ▼'}
                    </AddButton>
                </BottomInfo>
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
    height: 26.8125rem;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
    background-color: rgb(25, 27, 42);

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        box-shadow: inset 0 -5rem 100px 1rem rgba(25, 27, 42, 1);
        pointer-events: none;
        z-index: 0;
    }
`

const Thumbnail = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.4;
`

const TopInfo = styled.div`
    position: absolute;
    top: 3rem;
    left: 3rem;
    right: 3rem;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (max-width: 480px) {
        top: 1.5rem;
        left: 1.5rem;
        right: 1.5rem;
    }
`

const Title = styled.div`
    color: ${themedPalette.white};
    font-size: 2.4rem;
    font-weight: 700;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);

    @media (max-width: 480px) {
        font-size: 1.5rem;
    }
`

const TagWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`

const BottomInfo = styled.div`
    position: absolute;
    bottom: 2rem;
    left: 3rem;
    right: 3rem;
    max-height: calc(26.8125rem - 2rem - 12rem);
    z-index: 2;
    display: flex;
    flex-direction: column;

    @media (max-width: 480px) {
        bottom: 1.5rem;
        left: 1.5rem;
        right: 1.5rem;
    }
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
    z-index: 1;
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
            : 'linear-gradient(to right, transparent, rgb(25, 27, 42) 50%)'};
    transition:
        margin-top 0.4s ease,
        padding-left 0.4s ease,
        background 0.4s ease;

    &:hover {
        color: ${themedPalette.white};
    }
`
