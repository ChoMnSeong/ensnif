import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import Image from '../common/Image'

import skip from '../../assets/skip.svg'
import volumeUp from '../../assets/volumeUp.svg'
import volumeDown from '../../assets/volumeDown.svg'

interface VideoPlayerRightProps {
    skipHandler: () => void
    mutedHandler: () => void
    sound: number
    soundChangeHandler: (newSound: number) => void
}

const VideoPlayerRight: React.FC<VideoPlayerRightProps> = ({
    skipHandler,
    mutedHandler,
    sound,
    soundChangeHandler,
}) => {
    const [isDragging, setIsDragging] = useState(false)
    const trackRef = useRef<HTMLDivElement>(null)
    const thumbRef = useRef<HTMLDivElement>(null)

    const handleMouseDown = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            setIsDragging(true)
            e.preventDefault()
        },
        [],
    )

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging || !trackRef.current || !thumbRef.current) return

            const trackRect = trackRef.current.getBoundingClientRect()
            const position = e.clientX - trackRect.left
            let percentage = (position / trackRect.width) * 100
            percentage = Math.max(0, Math.min(100, percentage))
            const newSound = Math.round(percentage)
            soundChangeHandler(newSound)
        },
        [isDragging, soundChangeHandler],
    )

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        } else {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, handleMouseMove, handleMouseUp])

    const thumbPosition = sound
    const progressWidth = sound

    return (
        <Container>
            <SkipButton onClick={skipHandler}>
                <Image src={skip} alt={'10초 건너뛰기'} />
            </SkipButton>
            <Controls>
                <MuteButton onClick={mutedHandler}>
                    <Image
                        src={sound === 0 ? volumeDown : volumeUp}
                        alt={sound === 0 ? '음소거 해제' : '음소거'}
                    />
                </MuteButton>

                <CustomRangeContainer>
                    <Track ref={trackRef}>
                        <Progress style={{ width: `${progressWidth}%` }} />
                        <Thumb
                            ref={thumbRef}
                            style={{ left: `${thumbPosition}%` }}
                            onMouseDown={handleMouseDown}
                        />
                    </Track>
                </CustomRangeContainer>
            </Controls>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2rem;
`

const SkipButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
`

const MuteButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        opacity: 0.7;
    }
`

const CustomRangeContainer = styled.div`
    width: 6rem;
    height: 1rem;
    display: flex;
    align-items: center;
    position: relative;
    margin-left: 0.5rem;
    opacity: 0;
    pointer-events: none;
    transform: translateX(-10px);
    transition:
        opacity 0.3s ease,
        transform 0.3s ease;
`

const Controls = styled.div`
    display: flex;
    align-items: center;
    position: relative;

    &:hover ${MuteButton} {
        transform: translateX(-20px);
    }

    &:hover ${CustomRangeContainer} {
        opacity: 1;
        transform: translateX(0);
        pointer-events: auto;
    }
`

const Track = styled.div`
    width: 100%;
    height: 40%;
    background: #ddd;
    border-radius: 5px;
    position: relative;
`

const Progress = styled.div`
    height: 100%;
    background: #b473f9;
    border-radius: 5px;
    position: absolute;
    top: 0;
    left: 0;
`

const Thumb = styled.div`
    width: 16px;
    height: 16px;
    background: #b473f9;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
`

export default VideoPlayerRight
