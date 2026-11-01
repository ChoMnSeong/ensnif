import { useRef, useCallback, useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import VideoPlayer from '@components/player/VideoPlayer'
import PlayerControls from '@components/player/controls/PlayerControls'
import ProgressBar from '@components/player/controls/ProgressBar'
import LeftControls from '@components/player/controls/LeftControls'
import RightControls from '@components/player/controls/RightControls'
import SettingsMenu from '@components/player/controls/SettingsMenu'
import { useShakaPlayer } from '@hooks/player/useShakaPlayer'
import { usePlaybackRate } from '@hooks/player/usePlaybackRate'
import { useVideoProgress } from '@hooks/player/useVideoProgress'
import { useVideoControls } from '@hooks/player/useVideoControls'
import { useVolumeControl } from '@hooks/player/useVolumeControl'
import { useFullscreen } from '@hooks/player/useFullscreen'
import { useWatchHistory } from '@hooks/player/useWatchHistory'
import { usePictureInPicture } from '@hooks/player/usePictureInPicture'
import customCookie from '@libs/customCookie'

interface VideoPlayerContainerProps {
    src: string
    poster?: string
    episodeId: string
    initialTime?: number
}

const VideoPlayerContainer: React.FC<VideoPlayerContainerProps> = ({ src, poster, episodeId, initialTime }) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const hasProfileToken = !!customCookie.get.profileToken()
    const { t } = useTranslation()

    const { qualities, selectedQuality, activeQualityHeight, selectQuality } =
        useShakaPlayer(videoRef, hasProfileToken ? src : '', episodeId)

    const { playbackRate, changePlaybackRate, syncPlaybackRate } =
        usePlaybackRate(videoRef)

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
        setIsPlaying,
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

    useWatchHistory(videoRef, episodeId, isPlaying)

    // 한 번이라도 재생이 시작된 뒤에만 PiP(미니 플레이어)를 활성화한다.
    const [playbackStarted, setPlaybackStarted] = useState(false)
    useEffect(() => {
        if (isPlaying) setPlaybackStarted(true)
    }, [isPlaying])

    const { isPiP, dismiss } = usePictureInPicture(wrapperRef, playbackStarted)

    // 미니 플레이어에서 원래 위치로 부드럽게 스크롤 (다시 보이면 PiP 자동 해제)
    const expandFromPiP = useCallback(() => {
        wrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, [])

    // 미니 플레이어 닫기: 재생을 멈추고 다시 화면에 들어올 때까지 숨긴다.
    const closePiP = useCallback(() => {
        const video = videoRef.current
        if (video && !video.paused) {
            video.pause()
            setIsPlaying(false)
        }
        dismiss()
    }, [dismiss, setIsPlaying])

    const handleLoadedMetadata = useCallback(() => {
        onLoadedMetadata()
        syncPlaybackRate()
        if (hasProfileToken) {
            if (initialTime && initialTime > 0) {
                const video = videoRef.current
                if (video) video.currentTime = initialTime
            }
            autoPlay(muteSync)
        }
    }, [
        onLoadedMetadata,
        syncPlaybackRate,
        autoPlay,
        muteSync,
        hasProfileToken,
        initialTime,
        videoRef,
    ])

    const [controlsVisible, setControlsVisible] = useState(true)
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    // 설정 메뉴가 열려 있으면 컨트롤 바를 숨기지 않는다.
    const settingsOpenRef = useRef(false)

    const showControls = useCallback(() => {
        setControlsVisible(true)
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
        if (settingsOpenRef.current) return
        hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3000)
    }, [])

    const hideControlsNow = useCallback(() => {
        if (settingsOpenRef.current) return
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
        setControlsVisible(false)
    }, [])

    const handleSettingsOpenChange = useCallback(
        (open: boolean) => {
            settingsOpenRef.current = open
            showControls()
        },
        [showControls],
    )

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
                    <span>{t('player.loginRequired')}</span>
                </LoginOverlay>
            </PosterWrapper>
        )
    }

    return (
        <VideoPlayer
            wrapperRef={wrapperRef}
            containerRef={containerRef}
            videoRef={videoRef}
            onTimeUpdate={updateProgress}
            onLoadedMetadata={handleLoadedMetadata}
            cursorHidden={!controlsVisible}
            isPiP={isPiP}
            onExpand={expandFromPiP}
            onClose={closePiP}
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
                {/* 미니 플레이어는 폭이 좁아 메뉴가 잘리므로 설정을 감춘다. */}
                {!isPiP && (
                    <SettingsMenu
                        qualities={qualities}
                        selectedQuality={selectedQuality}
                        activeQualityHeight={activeQualityHeight}
                        playbackRate={playbackRate}
                        onSelectQuality={selectQuality}
                        onSelectPlaybackRate={changePlaybackRate}
                        onOpenChange={handleSettingsOpenChange}
                    />
                )}
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
