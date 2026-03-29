import { memo } from 'react'
import styled from '@emotion/styled'

interface ProgressBarProps {
    duration: number
    currentProgress: number
    bufferProgress: number
    seekProgress: number
    seekToolTip: string
    seekToolTipPosition: string
    currentTime: string
    endTime: string
    onHover: (event: React.MouseEvent) => void
    onSeek: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    duration,
    currentProgress,
    bufferProgress,
    seekProgress,
    seekToolTip,
    seekToolTipPosition,
    currentTime,
    endTime,
    onHover,
    onSeek,
}) => {
    return (
        <Wrapper>
            <TimeLabel>{currentTime}</TimeLabel>

            <TrackContainer>
                <Track>
                    <TrackBg />
                    <TrackBuffer style={{ width: `${bufferProgress}%` }} />
                    <TrackCurrent style={{ width: `${currentProgress}%` }}>
                        <Thumb />
                    </TrackCurrent>
                    <SeekInput
                        type="range"
                        step="any"
                        max={duration}
                        value={seekProgress}
                        onMouseMove={onHover}
                        onChange={onSeek}
                    />
                </Track>
                <Tooltip style={{ left: seekToolTipPosition }}>
                    {seekToolTip}
                </Tooltip>
            </TrackContainer>

            <TimeLabel>{endTime}</TimeLabel>
        </Wrapper>
    )
}

export default memo(ProgressBar)

const Wrapper = styled.div`
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: clamp(0.25rem, 0.75vw, 0.75rem);
`

const TimeLabel = styled.time`
    flex-shrink: 0;
    font-size: clamp(10px, 1.2vw, 13px);
    color: #fafaf8;
    white-space: nowrap;

    @media (max-width: 480px) {
        display: none;
    }
`

const TrackContainer = styled.div`
    position: relative;
    flex: 1 1 0;
    min-width: 0;
    height: clamp(14px, 2vw, 20px);
    display: flex;
    align-items: center;
`

const Track = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: clamp(3px, 0.5vw, 5px);

    &:hover > div:last-child {
        transform: translateX(50%) scale(1);
    }
`

const TrackFill = styled.div`
    position: absolute;
    height: 100%;
    border-radius: 50px;
`

const TrackBg = styled(TrackFill)`
    width: 100%;
    background-color: rgba(255, 255, 255, 0.3);
`

const TrackBuffer = styled(TrackFill)`
    background-color: #d2a9ff;
    transition: width 200ms ease-out;
`

const TrackCurrent = styled(TrackFill)`
    position: relative;
    display: flex;
    align-items: center;
    background-color: #b473f9;
`

const Thumb = styled.div`
    position: absolute;
    right: 0;
    width: clamp(10px, 1.2vw, 14px);
    height: clamp(10px, 1.2vw, 14px);
    border-radius: 50%;
    background-color: #b46eff;
    transform: translateX(50%) scale(0);
    transition: transform 200ms ease-out;
`

const SeekInput = styled.input`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
    margin: 0;
`

const Tooltip = styled.span`
    position: absolute;
    bottom: calc(100% + 0.5rem);
    padding: 0.25rem 0.5rem;
    background-color: rgba(0, 0, 0, 0.85);
    border-radius: 4px;
    font-size: clamp(10px, 1.2vw, 12px);
    font-weight: 700;
    color: white;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transform: translateX(-50%);
    transition: opacity 200ms ease-out;

    ${TrackContainer}:hover & {
        opacity: 1;
    }
`
