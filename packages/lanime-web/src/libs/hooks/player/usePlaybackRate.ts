import { useCallback, useRef, useState } from 'react'

export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const

export const usePlaybackRate = (
    videoRef: React.RefObject<HTMLVideoElement | null>,
) => {
    const [playbackRate, setPlaybackRate] = useState(1)
    // 소스가 바뀐 뒤 다시 적용해야 하므로 최신 값을 ref에도 들고 있는다.
    const playbackRateRef = useRef(1)

    const changePlaybackRate = useCallback(
        (rate: number) => {
            const video = videoRef.current
            if (!video) return

            playbackRateRef.current = rate
            video.defaultPlaybackRate = rate
            video.playbackRate = rate
            setPlaybackRate(rate)
        },
        [videoRef],
    )

    // 새 소스를 로드하면 브라우저가 배속을 1로 되돌리므로 다시 맞춰준다.
    const syncPlaybackRate = useCallback(() => {
        const video = videoRef.current
        if (!video || video.playbackRate === playbackRateRef.current) return

        video.defaultPlaybackRate = playbackRateRef.current
        video.playbackRate = playbackRateRef.current
    }, [videoRef])

    return { playbackRate, changePlaybackRate, syncPlaybackRate }
}
