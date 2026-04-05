import { useRef, useCallback, useState, useEffect } from 'react'
import styled from '@emotion/styled'
import VideoPlayer from '@components/player/VideoPlayer'
import PlayerControls from '@components/player/controls/PlayerControls'
import ProgressBar from '@components/player/controls/ProgressBar'
import LeftControls from '@components/player/controls/LeftControls'
import RightControls from '@components/player/controls/RightControls'
import { useShakaPlayer } from '@hooks/player/useShakaPlayer'
import { useVideoProgress } from '@hooks/player/useVideoProgress'
import { useVideoControls } from '@hooks/player/useVideoControls'
import { useVolumeControl } from '@hooks/player/useVolumeControl'
import { useFullscreen } from '@hooks/player/useFullscreen'
import customCookie from '@libs/customCookie'

interface VideoPlayerContainerProps {
    src: string
    poster?: string
}

const VideoPlayerContainer: React.FC<VideoPlayerContainerProps> = ({ src, poster }) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const hasProfileToken = !!customCookie.get.profileToken()

    useShakaPlayer(videoRef, hasProfileToken ? src : '')

    const {
        videoDuration,
        currentTime,
        endTime,
        currentProgress,
        bufferProgress,
        seekProgress,
        setCurrentProgress,
        setSeekProgress,
        updateProgress,
        onLoadedMetadata,
    } = useVideoProgress(videoRef)

    const {
        isPlaying,
        autoPlay,
        togglePlay,
        rewind,
        skip,
        onSeekHover,
        onSeek,
        seekToolTip,
        seekToolTipPosition,
    } = useVideoControls(videoRef, setCurrentProgress, setSeekProgress)

    const { sound, muted, changeVolume, toggleMute, muteSync } = useVolumeControl(videoRef)

    const { toggleFullscreen } = useFullscreen(containerRef)

    const handleLoadedMetadata = useCallback(() => {
        onLoadedMetadata()
        if (hasProfileToken) {
            autoPlay(muteSync)
        }
    }, [onLoadedMetadata, autoPlay, muteSync, hasProfileToken])

    const [controlsVisible, setControlsVisible] = useState(true)
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const showControls = useCallback(() => {
        setControlsVisible(true)
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
        hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3000)
    }, [])

    const hideControlsNow = useCallback(() => {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
        setControlsVisible(false)
    }, [])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        if (!hasProfileToken) return

        container.addEventListener('mousemove', showControls)
        container.addEventListener('mouseleave', hideControlsNow)
        document.addEventListener('fullscreenchange', showControls)
        document.addEventListener('webkitfullscreenchange', showControls)
        showControls()
        return () => {
            container.removeEventListener('mousemove', showControls)
            container.removeEventListener('mouseleave', hideControlsNow)
            document.removeEventListener('fullscreenchange', showControls)
            document.removeEventListener('webkitfullscreenchange', showControls)
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
        }
    }, [showControls, hideControlsNow, hasProfileToken])

    if (!hasProfileToken) {
        return (
            <PosterWrapper>
                <PosterImage src={poster} alt="poster" />
                <LoginOverlay>
                    <span>로그인이 필요한 서비스입니다.</span>
                </LoginOverlay>
            </PosterWrapper>
        )
    }

    return (
        <VideoPlayer
            containerRef={containerRef}
            videoRef={videoRef}
            onTimeUpdate={updateProgress}
            onLoadedMetadata={handleLoadedMetadata}
            cursorHidden={!controlsVisible}
        >
            <PlayerControls
                isPlaying={isPlaying}
                visible={controlsVisible}
                onTogglePlay={togglePlay}
                onToggleFullscreen={toggleFullscreen}
            >
                <LeftControls onRewind={rewind} />
                <ProgressBar
                    duration={videoDuration}
                    currentTime={currentTime}
                    endTime={endTime}
                    currentProgress={currentProgress}
                    bufferProgress={bufferProgress}
                    seekProgress={seekProgress}
                    seekToolTip={seekToolTip}
                    seekToolTipPosition={seekToolTipPosition}
                    onHover={onSeekHover}
                    onSeek={onSeek}
                />
                <RightControls
                    sound={sound}
                    muted={muted}
                    onSkip={skip}
                    onToggleMute={toggleMute}
                    onVolumeChange={changeVolume}
                />
            </PlayerControls>
        </VideoPlayer>
    )
}

export default VideoPlayerContainer

const PosterWrapper = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 8px;
    overflow: hidden;
    background: #000;
`

const PosterImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.6;
`

const LoginOverlay = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 1.1rem;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`
