import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
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
            {hasPrev && (
                <AnimeTrackMoveButton onClick={onPrev} isPrev>
                    <Icon name="chevronLeft" size={28} color="white" />
                </AnimeTrackMoveButton>
            )}
            <AnimeCardTrackBlock state={state}>{children}</AnimeCardTrackBlock>
            {hasNext && (
                <AnimeTrackMoveButton onClick={onNext}>
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

const AnimeTrackMoveButton = styled.button<{ isPrev?: boolean }>`
    opacity: 0;
    transition: opacity 250ms ease-in-out;
    z-index: 4;
    position: absolute;
    top: 0;
    height: calc(var(--card-w) * 0.557047);
    width: 2.5em;
    background-color: rgba(0, 0, 0, 0.45);
    border: none;
    padding: 0;
    font-size: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    ${({ isPrev }) => (isPrev ? 'left: 0;' : 'right: 0;')}

    &:hover {
        animation: ${fadeIn} 250ms ease-in;
        opacity: 1;
    }
`

const AnimeCardTrackWrapper = styled.div`
    --card-w: 18.625em;

    @media (max-width: 1023px) {
        --card-w: 13em;
    }
    @media (max-width: 767px) {
        --card-w: 10em;
    }

    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    user-select: none;
    width: 100%;
`

const AnimeCardTrackBlock = styled.ol<{ state: number }>`
    width: 100%;
    display: flex;
    gap: 0.375em;
    flex-wrap: nowrap;
    padding: 0 3.125em;
    min-height: calc(var(--card-w) * 0.75);
    overflow-x: visible;
    transform: ${({ state }) =>
        `translate3d(calc(${state} * -2 * var(--card-w)), 0px, 0px)`};
    transition: transform 300ms ease-in-out;

    @media (max-width: 767px) {
        padding: 0 1em;
    }
`
