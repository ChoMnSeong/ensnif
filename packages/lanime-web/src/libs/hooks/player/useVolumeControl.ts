import { useState, useCallback } from 'react'

export const useVolumeControl = (
    videoRef: React.RefObject<HTMLVideoElement | null>,
) => {
    const [sound, setSound] = useState(50)
    const [muted, setMuted] = useState(false)

    const changeVolume = useCallback(
        (newSound: number) => {
            const video = videoRef.current
            if (!video) return

            const clamped = Math.max(0, Math.min(100, newSound))
            setSound(clamped)
            video.volume = clamped / 100

            const shouldMute = clamped === 0
            setMuted(shouldMute)
            video.muted = shouldMute
        },
        [videoRef],
    )

    const toggleMute = useCallback(() => {
        const video = videoRef.current
        if (!video) return

        if (muted || sound === 0) {
            const restored = sound > 0 ? sound : 50
            setSound(restored)
            setMuted(false)
            video.volume = restored / 100
            video.muted = false
        } else {
            setSound(0)
            setMuted(true)
            video.volume = 0
            video.muted = true
        }
    }, [videoRef, muted, sound])

    const muteSync = useCallback(() => {
        const video = videoRef.current
        if (!video) return
        setMuted(true)
        video.muted = true
    }, [videoRef])

    return { sound, muted, changeVolume, toggleMute, muteSync }
}
