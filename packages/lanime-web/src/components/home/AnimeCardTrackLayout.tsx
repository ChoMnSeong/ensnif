import React from 'react'
import styled from '@emotion/styled'
import Icon from '@components/common/Icon'

interface AnimeCardTrackViewProps {
    state: number
    hasPrev: boolean
    hasNext: boolean
    onNext: () => void
    onPrev: () => void
    children: React.ReactNode
}

const AnimeCardTrackLayout: React.FC<AnimeCardTrackViewProps> = ({
    state,
    hasPrev,
    hasNext,
    onNext,
    onPrev,
    children,
}) => {
    return (
        <AnimeCardTrackWrapper>
            <AnimeTrackMoveButton onClick={onPrev} isPrev disabled={!hasPrev}>
                <Icon name="chevronLeft" size={28} color="white" />
            </AnimeTrackMoveButton>
            <AnimeCardTrackBlock state={state}>
                {children}
            </AnimeCardTrackBlock>
            <AnimeTrackMoveButton onClick={onNext} disabled={!hasNext}>
                <Icon name="chevronRight" size={28} color="white" />
            </AnimeTrackMoveButton>
        </AnimeCardTrackWrapper>
    )
}

export default AnimeCardTrackLayout
const AnimeTrackMoveButton = styled.button<{ isPrev?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 250ms ease-in-out;
    z-index: 20;
    position: absolute;
    top: 0;
    bottom: 0;
    height: auto;
    width: 3.125em;
    background-color: rgba(0, 0, 0, 0.45);
    border: none;
    font-size: inherit;
    cursor: pointer;

    ${({ isPrev }) => (isPrev ? 'left: 0;' : 'right: 0;')}

    &:disabled {
        display: none;
    }

    &:hover {
        background-color: rgba(0, 0, 0, 0.65);
    }
`

const AnimeCardTrackWrapper = styled.div`
    --card-w: 24.5em;

    @media (max-width: 1023px) {
        --card-w: 20em;
    }
    @media (max-width: 767px) {
        --card-w: 16em;
    }

    position: relative;
    width: 100%;
    user-select: none;

    &:hover ${AnimeTrackMoveButton}:not(:disabled) {
        opacity: 1;
    }

    @media (max-width: 767px) {
        ${AnimeTrackMoveButton} {
            width: 2em;
        }
    }
`

const AnimeCardTrackBlock = styled.ol<{ state: number }>`
    --items-per-page: 4;
    --move-amount: 3;

    @media (max-width: 1023px) {
        --items-per-page: 3;
        --move-amount: 2;
    }
    @media (max-width: 767px) {
        --items-per-page: 2;
        --move-amount: 1;
    }

    display: flex;
    flex-wrap: nowrap;
    gap: 1.5em;
    padding: 0 3.125em;
    width: 100%;
    box-sizing: border-box;
    overflow-x: visible;
    transform: ${({ state }) =>
        `translate3d(calc(${state} * -1 * var(--move-amount) * (var(--card-w) + 1.5em)), 0px, 0px)`};
    transition: transform 300ms ease-in-out;
    list-style: none;
    margin: 0;

    @media (max-width: 767px) {
...
        padding: 0 1em;
    }
`
