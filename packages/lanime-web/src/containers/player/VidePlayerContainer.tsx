import { useRef, useCallback, useState, useEffect } from 'react'
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

interface VideoPlayerContainerProps {
    src: string
}

const VideoPlayerContainer: React.FC<VideoPlayerContainerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useShakaPlayer(videoRef, src)

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
        autoPlay(muteSync)
    }, [onLoadedMetadata, autoPlay, muteSync])

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
    }, [showControls, hideControlsNow])

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
