import { useState, useRef, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import Icon from '@components/common/Icon'
import { themedPalette } from '@/libs/style/theme'

interface RightControlsProps {
    sound: number
    muted: boolean
    onSkip: () => void
    onToggleMute: () => void
    onVolumeChange: (newSound: number) => void
}

const RightControls: React.FC<RightControlsProps> = ({
    sound,
    muted,
    onSkip,
    onToggleMute,
    onVolumeChange,
}) => {
    const [isDragging, setIsDragging] = useState(false)
    const trackRef = useRef<HTMLDivElement>(null)

    const handleTrackClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const track = trackRef.current
            if (!track) return

            const rect = track.getBoundingClientRect()
            const pct = ((e.clientX - rect.left) / rect.width) * 100
            onVolumeChange(Math.round(Math.max(0, Math.min(100, pct))))
        },
        [onVolumeChange],
    )

    const handleMouseDown = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            setIsDragging(true)
            e.preventDefault()
        },
        [],
    )

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging || !trackRef.current) return

            const rect = trackRef.current.getBoundingClientRect()
            const pct = ((e.clientX - rect.left) / rect.width) * 100
            onVolumeChange(Math.round(Math.max(0, Math.min(100, pct))))
        },
        [isDragging, onVolumeChange],
    )

    const handleMouseUp = useCallback(() => setIsDragging(false), [])

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, handleMouseMove, handleMouseUp])

    return (
        <Container>
            <IconButton onClick={onSkip} aria-label="10초 앞으로">
                <Icon
                    color={themedPalette.white}
                    name="skip"
                    aria-label="10초 앞으로"
                />
            </IconButton>

            <VolumeGroup>
                <MuteButton
                    onClick={onToggleMute}
                    aria-label={sound === 0 ? '음소거 해제' : '음소거'}
                >
                    <Icon
                        color={themedPalette.white}
                        name={muted || sound === 0 ? 'volumeOff' : 'volumeUp'}
                        aria-label={muted || sound === 0 ? '음소거 해제' : '음소거'}
                    />
                </MuteButton>

                <VolumeSlider>
                    <VolumeTrack
                        ref={trackRef}
                        onClick={handleTrackClick}
                        onMouseDown={handleMouseDown}
                    >
                        <VolumeFill style={{ width: `${sound}%` }} />
                        <VolumeThumb style={{ left: `${sound}%` }} />
                    </VolumeTrack>
                </VolumeSlider>
            </VolumeGroup>
        </Container>
    )
}

export default RightControls

const Container = styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: clamp(0.25rem, 0.75vw, 0.75rem);
`

const IconButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.7;
    }
`

const VolumeGroup = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`

const MuteButton = styled(IconButton)`
    transition:
        transform 0.25s ease,
        opacity 0.2s;

    ${VolumeGroup}:hover & {
        transform: translateX(-4px);
    }
`

const VolumeSlider = styled.div`
    width: clamp(40px, 6vw, 80px);
    height: 20px;
    display: flex;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transform: translateX(-8px);
    transition:
        opacity 0.25s ease,
        transform 0.25s ease;

    ${VolumeGroup}:hover & {
        opacity: 1;
        transform: translateX(0);
        pointer-events: auto;
    }

    @media (max-width: 480px) {
        display: none;
    }
`

const VolumeTrack = styled.div`
    position: relative;
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    cursor: pointer;
`

const VolumeFill = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: #b473f9;
    border-radius: 4px;
    pointer-events: none;
`

const VolumeThumb = styled.div`
    position: absolute;
    top: 50%;
    width: clamp(10px, 1.2vw, 14px);
    height: clamp(10px, 1.2vw, 14px);
    background: #b473f9;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    cursor: grab;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
    pointer-events: none;
`
