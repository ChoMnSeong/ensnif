import { useState, useCallback } from 'react'
import { formatTime } from '@libs/formatTime'

export const useVideoProgress = (
    videoRef: React.RefObject<HTMLVideoElement | null>,
) => {
    const [videoDuration, setVideoDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState('00:00')
    const [endTime, setEndTime] = useState('00:00')
    const [currentProgress, setCurrentProgress] = useState(0)
    const [bufferProgress, setBufferProgress] = useState(0)
    const [seekProgress, setSeekProgress] = useState(0)

    const updateProgress = useCallback(() => {
        const video = videoRef.current
        if (!video) return

        const duration = video.duration || 0
        const current = video.currentTime || 0
        const buffer = video.buffered

        setCurrentProgress((current / duration) * 100)
        setSeekProgress(current)
        setCurrentTime(formatTime(Math.round(current)))
        setEndTime(formatTime(duration))

        if (duration > 0) {
            for (let i = buffer.length - 1; i >= 0; i--) {
                if (buffer.start(i) <= video.currentTime) {
                    setBufferProgress((buffer.end(i) / duration) * 100)
                    break
                }
            }
        }
    }, [videoRef])

    const onLoadedMetadata = useCallback(() => {
        const video = videoRef.current
        if (!video) return
        setVideoDuration(video.duration)
        updateProgress()
    }, [videoRef, updateProgress])

    return {
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
    }
}
