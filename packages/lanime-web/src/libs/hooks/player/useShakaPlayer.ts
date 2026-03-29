import { useEffect, useRef, useState, useCallback } from 'react'
import shaka from 'shaka-player'
import useInterval from '@components/player/hook/useInterval'

export const useShakaPlayer = (
    videoRef: React.RefObject<HTMLVideoElement | null>,
    src: string,
) => {
    const shakaPlayerRef = useRef<shaka.Player | null>(null)
    const [resolutions, setResolutions] = useState<shaka.extern.TrackList>([])
    const [activeResolutionHeight, setActiveResolutionHeight] = useState<
        number | 'auto'
    >('auto')
    const [setResolutionInterval, clearResolutionInterval] = useInterval()

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const player = new shaka.Player(video)
        shakaPlayerRef.current = player

        const init = async () => {
            await player.load(src)

            const tracks = player.getVariantTracks()
            const sorted = [...tracks].sort(
                (a, b) => (a.height ?? 0) - (b.height ?? 0),
            )
            setResolutions(sorted)
        }

        init()

        const handlePageHide = (e: PageTransitionEvent) => {
            if (e.persisted) {
                player.destroy()
                shakaPlayerRef.current = null
            }
        }
        window.addEventListener('pagehide', handlePageHide)

        return () => {
            window.removeEventListener('pagehide', handlePageHide)
            player.destroy()
        }
    }, [videoRef, src])

    useEffect(() => {
        if (activeResolutionHeight !== 'auto') {
            clearResolutionInterval()
            return
        }

        setResolutionInterval(() => {
            const player = shakaPlayerRef.current
            if (!player) return

            const tracks = player.getVariantTracks()
            const sorted = [...tracks].sort(
                (a, b) => (a.height ?? 0) - (b.height ?? 0),
            )
            setResolutions(sorted)
        }, 5000)
    }, [activeResolutionHeight, setResolutionInterval, clearResolutionInterval])

    const selectResolution = useCallback(
        (height: number | 'auto') => {
            const player = shakaPlayerRef.current
            if (!player) return

            if (height === 'auto') {
                player.configure({ abr: { enabled: true } })
            } else {
                const track = resolutions.find(
                    (t: { height: number }) => t.height === height,
                )
                if (track) {
                    player.configure({ abr: { enabled: false } })
                    player.selectVariantTrack(track)
                }
            }

            setActiveResolutionHeight(height)
        },
        [resolutions],
    )

    return {
        shakaPlayerRef,
        resolutions,
        activeResolutionHeight,
        selectResolution,
    }
}
