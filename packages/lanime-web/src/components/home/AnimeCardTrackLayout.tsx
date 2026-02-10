import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

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
                    ←
                </AnimeTrackMoveButton>
            )}
            <AnimeCardTrackBlock state={state}>{children}</AnimeCardTrackBlock>
            {hasNext && (
                <AnimeTrackMoveButton onClick={onNext}>→</AnimeTrackMoveButton>
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
    top: 50%;
    transform: translateY(-50%);
    height: 2.5rem;
    width: 2.5rem;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    ${({ isPrev }) => (isPrev ? 'left: 0.5rem;' : 'right: 0.5rem;')}

    &:hover, &:focus, &:active {
        opacity: 1;
    }
`

const AnimeCardTrackWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    user-select: none;
    width: 100%;

    &:hover ${AnimeTrackMoveButton} {
        animation: ${fadeIn} 250ms ease-in;
        opacity: 1;
    }
`

const AnimeCardTrackBlock = styled.ol<{ state: number }>`
    width: 100%;
    display: flex;
    gap: 0.375em;
    flex-wrap: nowrap;
    padding: 0px 3.125em;
    min-height: 14em;
    overflow-x: visible;
    transform: ${({ state }) =>
        `translate3d(${state * 2 * -18.625}em, 0px, 0px);`};
    transition: transform 300ms ease-in-out;
`
