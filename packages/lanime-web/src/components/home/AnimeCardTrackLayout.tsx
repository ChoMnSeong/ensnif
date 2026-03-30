import React from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import Icon from '@components/common/Icon'
import Flex from '@components/common/Flex'

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
        <AnimeCardTrackWrapper
            direction="column"
            align="flex-start"
            width="100%"
        >
            {hasPrev && (
                <AnimeTrackMoveButton
                    as="button"
                    align="center"
                    justify="center"
                    onClick={onPrev}
                    isPrev
                >
                    <Icon name="chevronLeft" size={28} color="white" />
                </AnimeTrackMoveButton>
            )}
            <AnimeCardTrackBlock
                as="ol"
                state={state}
                width="100%"
                gap="0.375em"
                padding="0 3.125em"
            >
                {children}
            </AnimeCardTrackBlock>
            {hasNext && (
                <AnimeTrackMoveButton
                    as="button"
                    align="center"
                    justify="center"
                    onClick={onNext}
                >
                    <Icon name="chevronRight" size={28} color="white" />
                </AnimeTrackMoveButton>
            )}
        </AnimeCardTrackWrapper>
    )
}

export default AnimeCardTrackLayout

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const AnimeTrackMoveButton = styled(Flex)<{ isPrev?: boolean }>`
    opacity: 0;
    transition: opacity 250ms ease-in-out;
    z-index: 4;
    position: absolute;
    top: 0;
    height: calc(var(--card-w) * 0.557047);
    width: 2.5em;
    background-color: rgba(0, 0, 0, 0.45);
    border: none;
    font-size: inherit;
    cursor: pointer;

    ${({ isPrev }) => (isPrev ? 'left: 0;' : 'right: 0;')}

    &:hover {
        animation: ${fadeIn} 250ms ease-in;
        opacity: 1;
    }
`

const AnimeCardTrackWrapper = styled(Flex)`
    --card-w: 18.625em;

    @media (max-width: 1023px) {
        --card-w: 13em;
    }
    @media (max-width: 767px) {
        --card-w: 10em;
    }

    position: relative;
    user-select: none;
`

const AnimeCardTrackBlock = styled(Flex)<{ state: number }>`
    flex-wrap: nowrap;
    min-height: calc(var(--card-w) * 0.75);
    overflow-x: visible;
    transform: ${({ state }) =>
        `translate3d(calc(${state} * -2 * var(--card-w)), 0px, 0px)`};
    transition: transform 300ms ease-in-out;

    @media (max-width: 767px) {
        padding: 0 1em;
    }
`
