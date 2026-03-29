import { useRef, useState, useCallback } from 'react'
import { formatTime } from '@libs/formatTime'

export const useVideoControls = (
    videoRef: React.RefObject<HTMLVideoElement | null>,
    setCurrentProgress: (v: number) => void,
    setSeekProgress: (v: number) => void,
) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [seekToolTip, setSeekToolTip] = useState('00:00')
    const [seekToolTipPosition, setSeekToolTipPosition] = useState('')
    const progressSeekData = useRef(0)

    const autoPlay = useCallback(async (onMuted?: () => void) => {
        const video = videoRef.current
        if (!video) return

        video.muted = true
        try {
            await video.play()
            setIsPlaying(true)
            video.muted = false
            if (video.muted) {
                onMuted?.()
            }
        } catch {
            video.muted = false
            setIsPlaying(false)
        }
    }, [videoRef])

    const togglePlay = useCallback(() => {
        const video = videoRef.current
        if (!video) return

        setIsPlaying((prev) => {
            if (prev) {
                video.pause()
            } else {
                video.play()
            }
            return !prev
        })
    }, [videoRef])

    const rewind = useCallback(() => {
        const video = videoRef.current
        if (!video) return
        video.currentTime -= 10
    }, [videoRef])

    const skip = useCallback(() => {
        const video = videoRef.current
        if (!video) return
        video.currentTime += 10
    }, [videoRef])

    const onSeekHover = useCallback(
        (event: React.MouseEvent) => {
            const video = videoRef.current
            if (!video) return

            const rect = event.currentTarget.getBoundingClientRect()
            const skipTo =
                (event.nativeEvent.offsetX / rect.width) * video.duration
            progressSeekData.current = skipTo

            if (skipTo > video.duration) {
                setSeekToolTip(formatTime(video.duration))
            } else if (skipTo < 0) {
                setSeekToolTip('00:00')
            } else {
                setSeekToolTip(formatTime(skipTo))
                setSeekToolTipPosition(`${event.nativeEvent.offsetX}px`)
            }
        },
        [videoRef],
    )

    const onSeek = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const video = videoRef.current
            if (!video) return

            const skipTo = progressSeekData.current || +event.target.value
            video.currentTime = skipTo
            setCurrentProgress((skipTo / video.duration) * 100)
            setSeekProgress(skipTo)
        },
        [videoRef, setCurrentProgress, setSeekProgress],
    )

    return {
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
    }
}
