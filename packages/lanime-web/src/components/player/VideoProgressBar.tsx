import { Fragment, memo } from 'react'
import styled from '@emotion/styled'

interface VideoPlayerProgressBarProps {
    bufferProgress: number
    currentProgress: number
    seekProgress: number
    seekToolTipPosition: string
    seekToolTip: string
    onSeek?: (event: React.ChangeEvent<HTMLInputElement>) => void
    onHover?: (event: React.MouseEvent) => void
    currentTime?: string
    endTime?: string
    duration: number
}

const VideoPlayerProgressBar: React.FC<VideoPlayerProgressBarProps> = ({
    bufferProgress,
    currentProgress,
    seekProgress,
    seekToolTipPosition,
    seekToolTip,
    onHover,
    onSeek,
    currentTime,
    endTime,
    duration,
}) => {
    return (
        <Fragment>
            <Time>{currentTime}</Time>
            <ProgressContainer>
                <ProgressRange>
                    <Background />
                    <Buffer style={{ width: `${bufferProgress}%` }} />
                    <Current style={{ width: `${currentProgress}%` }}>
                        <Thumb />
                    </Current>
                    <SeekInput
                        type="range"
                        step="any"
                        max={duration}
                        value={seekProgress}
                        onMouseMove={onHover}
                        onChange={onSeek}
                    />
                </ProgressRange>
                <Tooltip style={{ left: seekToolTipPosition }}>
                    {seekToolTip}
                </Tooltip>
            </ProgressContainer>
            <Time>{endTime}</Time>
        </Fragment>
    )
}

export default memo(VideoPlayerProgressBar)

const ProgressContainer = styled.div`
    position: relative;
    width: 90%;
    height: 40%;
`

const ProgressRange = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
`

const ProgressBar = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50px;
`

const Background = styled(ProgressBar)`
    background-color: #858585;
`

const Buffer = styled(ProgressBar)`
    background-color: #d2a9ff;
    transition: width 200ms ease-out;
`

const Current = styled(ProgressBar)`
    position: relative;
    display: flex;
    align-items: center;
    background-color: #b473f9;
`

const Thumb = styled.div`
    position: absolute;
    right: 0;
    width: 1em;
    height: 1em;
    border-radius: 50px;
    background-color: #b46eff;
    transform: translateX(50%) scale(0);
    transition: transform 200ms ease-out;

    ${ProgressRange}:hover & {
        transform: translateX(50%) scale(1);
    }
`

const SeekInput = styled.input`
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
`

const Tooltip = styled.span`
    position: absolute;
    bottom: 1em;
    padding: 0.5rem 0.75rem;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 5px;
    font-weight: 700;
    color: white;
    pointer-events: none;
    opacity: 0;
    transform: translateX(-50%);
    transition: opacity 200ms ease-out;

    ${ProgressContainer}:hover & {
        opacity: 1;
    }
`

const Time = styled.time`
    width: clamp(10rem, 20%, 20rem);
    text-align: center;
    color: #fafaf8;
`
