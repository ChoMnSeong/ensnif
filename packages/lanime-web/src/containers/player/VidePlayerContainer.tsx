import { useEffect, useRef, useState, useCallback } from 'react'
import VideoPlayerControllerContainer from './VideoPlayerControllerContainer'
import VideoPlayer from '../../components/player/VideoPlayer'
import shaka from 'shaka-player'
import { formatTime } from '../../libs/formatTime'
import useInterval from '../../components/player/hook/useInterval'

interface VideoPlayerContainerProps {
    src: string
}

const VideoPlayerContainer: React.FC<VideoPlayerContainerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const videoContainerRef = useRef<HTMLDivElement>(null)
    const shakaPlayer = useRef<shaka.Player>(null)
    const playPromise = useRef<Promise<void>>(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [videoDuration, setVideoDuration] = useState<number>(0)
    const [currentTime, setCurrentTime] = useState('00:00')
    const [endTime, setEndTime] = useState('00:00')
    const [currentProgress, setCurrentProgress] = useState(0)
    const [bufferProgress, setBufferProgress] = useState(0)
    const [seekProgress, setSeekProgress] = useState(0)
    const [resolutions, setResolutions] = useState<shaka.extern.TrackList>([])

    const [setResolutionInterval, clearResolutionInterval] = useInterval()
    const [activeResolutionHeight] = useState<number | 'auto'>('auto')
    const [hasInteracted, setHasInteracted] = useState<boolean>(false)

    const timeChangeHandler = useCallback(() => {
        const video = videoRef.current!

        const duration = video.duration || 0
        const currentTime = video.currentTime || 0
        const buffer = video.buffered

        // Progress
        setCurrentProgress((currentTime / duration) * 100)
        setSeekProgress(currentTime)

        if (duration > 0) {
            for (let i = 0; i < buffer.length; i++) {
                if (
                    buffer.start(buffer.length - 1 - i) === 0 ||
                    buffer.start(buffer.length - 1 - i) < video.currentTime
                ) {
                    setBufferProgress(
                        (buffer.end(buffer.length - 1 - i) / duration) * 100,
                    )
                    break
                }
            }
        }

        // Time
        const formattedCurrentTime = formatTime(Math.round(currentTime))
        setCurrentTime(formattedCurrentTime)
        setEndTime(formatTime(duration))
    }, [])

    const videoLoadedHandler = useCallback(() => {
        const video = videoRef.current!
        const player = shakaPlayer.current

        if (
            player &&
            resolutions.length > 0 &&
            activeResolutionHeight !== 'auto'
        ) {
            const matchedResolution = resolutions.find(
                (track) => track.height === activeResolutionHeight,
            )

            if (matchedResolution) {
                player.configure({ abr: { enabled: false } })
                player.selectVariantTrack(matchedResolution)
            }
        }
        setVideoDuration(video.duration)

        playPromise.current = video
            .play()
            .then(() => {
                timeChangeHandler()
            })
            .catch(() => {
                setIsPlaying(false)
            })
    }, [resolutions, activeResolutionHeight, timeChangeHandler])

    useEffect(() => {
        const interacted = localStorage.getItem('hasInteracted') === 'true'
        if (interacted) {
            setHasInteracted(true) // 상호작용 상태를 업데이트
        }
    }, [])

    useEffect(() => {
        const video = videoRef.current!

        const player = new shaka.Player(video)

        ;(async () => {
            await player.load(src)
            shakaPlayer.current = player

            const tracks = player.getVariantTracks()
            const sortedTracks = tracks.sort((trackA, trackB) =>
                (trackA?.height || 0) < (trackB?.height || 0) ? -1 : 1,
            )
            setResolutions(sortedTracks)

            try {
                await video.play()
                setIsPlaying(true)
            } catch (error) {
                console.warn('Auto play failed:', error)
                setIsPlaying(false)
            }
        })()
    }, [src, hasInteracted])

    useEffect(() => {
        if (activeResolutionHeight !== 'auto') {
            clearResolutionInterval()
            return
        }

        setResolutionInterval(() => {
            const player = shakaPlayer.current
            if (!player) return

            const tracks = player.getVariantTracks()
            const sortedTracks = tracks.sort(
                (trackA: { height: unknown }, trackB: { height: unknown }) =>
                    (trackA?.height || 0) < (trackB?.height || 0) ? -1 : 1,
            )
            setResolutions(sortedTracks)
        }, 5000)
    }, [activeResolutionHeight, setResolutionInterval, clearResolutionInterval])

    return (
        <VideoPlayer
            videoRef={videoRef}
            timeChangeHandler={timeChangeHandler}
            videoLoadedHandler={videoLoadedHandler}
            videoContainerRef={videoContainerRef}
        >
            <VideoPlayerControllerContainer
                duration={videoDuration}
                videoRef={videoRef}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                setSeekProgress={setSeekProgress}
                setCurrentProgress={setCurrentProgress}
                bufferProgress={bufferProgress}
                currentProgress={currentProgress}
                seekProgress={seekProgress}
                currentTime={currentTime}
                endTime={endTime}
                videoContainerRef={videoContainerRef}
            />
        </VideoPlayer>
    )
}

export default VideoPlayerContainer
