import { useRef, useState } from 'react'
import VideoProgressBar from '../../components/player/VideoProgressBar'
import VideoPlayerControllerLayout from '../../components/player/VideoControllerLayout'
import { formatTime } from '../../libs/formatTime'
import VideoPlayerRight from '../../components/player/VideoPlayerRight'
import VideoPlayerLeft from '../../components/player/VideoPlayerLeft'

interface VideoPlayerControllerContainerProps {
    videoRef: React.RefObject<HTMLVideoElement | null>
    videoContainerRef: React.RefObject<HTMLDivElement | null>
    isPlaying: boolean
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
    setSeekProgress: React.Dispatch<React.SetStateAction<number>>
    setCurrentProgress: React.Dispatch<React.SetStateAction<number>>
    bufferProgress: number
    currentProgress: number
    seekProgress: number
    currentTime: string
    endTime: string
    duration: number
    onResolutionChange?: (height: number | 'auto') => void
    availableResolutions?: unknown[]
}

interface WebkitDocument extends Document {
    webkitExitFullscreen?: () => Promise<void>
}
interface WebkitElement extends Element {
    webkitRequestFullscreen?: () => Promise<void>
}

const VideoPlayerControllerContainer: React.FC<
    VideoPlayerControllerContainerProps
> = ({
    duration,
    videoRef,
    videoContainerRef,
    bufferProgress,
    currentProgress,
    seekProgress,
    setSeekProgress,
    setCurrentProgress,
    currentTime,
    endTime,
    isPlaying,
    setIsPlaying,
}) => {
    const progressSeekData = useRef(0)

    const [sound, setSound] = useState<number>(50)
    const [muted, setMuted] = useState<boolean>(false)

    const [seekToolTip, setSeekToolTip] = useState('00:00')
    const [seekToolTipPosition, setSeekToolTipPosition] = useState('')

    const toggleFullscreenHandler = () => {
        const elem = document.documentElement as WebkitElement
        const doc = document as WebkitDocument

        if (document.fullscreenElement) {
            doc.exitFullscreen()
        } else {
            videoContainerRef.current!.requestFullscreen()
            elem.requestFullscreen()
        }
    }

    const seekMouseMoveHandler = (event: React.MouseEvent) => {
        const video = videoRef.current!

        const rect = event.currentTarget.getBoundingClientRect()
        const skipTo = (event.nativeEvent.offsetX / rect.width) * video.duration

        progressSeekData.current = skipTo

        let formattedTime: string

        if (skipTo > video.duration) {
            formattedTime = formatTime(video.duration)
        } else if (skipTo < 0) {
            formattedTime = '00:00'
        } else {
            formattedTime = formatTime(skipTo)
            setSeekToolTipPosition(`${event.nativeEvent.offsetX}px`)
        }

        setSeekToolTip(formattedTime)
    }

    const seekInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current!

        const skipTo = progressSeekData.current || +event.target.value

        video.currentTime = skipTo
        setCurrentProgress((skipTo / video.duration) * 100)
        setSeekProgress(skipTo)
    }

    const handleUserPlay = () => {
        const video = videoRef.current
        if (!video) return

        video.muted = !video.muted
        setIsPlaying((prev) => {
            const shouldPlay = !prev
            if (shouldPlay) {
                video.play()
            } else {
                video.pause()
            }
            return shouldPlay
        })
    }

    const rewindHandler = () => {
        const video = videoRef.current!

        video.currentTime -= 10
    }

    const skipHandler = () => {
        const video = videoRef.current!

        video.currentTime += 10
    }

    const soundChangeHandler = (newSound: number) => {
        const video = videoRef.current!
        setSound(newSound)
        video.volume = newSound / 100

        const shouldBeMuted = newSound === 0
        setMuted(shouldBeMuted)
        video.muted = shouldBeMuted
    }

    const mutedHandler = () => {
        const video = videoRef.current!

        if (video.volume !== 0) {
            setSound(0)
            setMuted(true)
        } else {
            setSound(50)
            setMuted(false)
        }
        video.volume = sound / 100
        video.muted = muted
    }

    return (
        <VideoPlayerControllerLayout
            togglePlay={handleUserPlay}
            isPlaying={isPlaying}
            handleFullScreen={toggleFullscreenHandler}
        >
            <VideoPlayerLeft rewindHandler={rewindHandler} />
            <VideoProgressBar
                duration={duration}
                currentTime={currentTime}
                bufferProgress={bufferProgress}
                currentProgress={currentProgress}
                seekProgress={seekProgress}
                seekToolTip={seekToolTip}
                seekToolTipPosition={seekToolTipPosition}
                onHover={seekMouseMoveHandler}
                onSeek={seekInputHandler}
                endTime={endTime}
            />
            <VideoPlayerRight
                skipHandler={skipHandler}
                mutedHandler={mutedHandler}
                sound={sound}
                soundChangeHandler={soundChangeHandler}
            />
        </VideoPlayerControllerLayout>
    )
}

export default VideoPlayerControllerContainer
