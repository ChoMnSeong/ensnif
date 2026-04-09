import { useCallback, useEffect, useRef } from 'react'
import { useSaveWatchHistory } from '@libs/apis/library'

const SAVE_INTERVAL_MS = 10_000

export const useWatchHistory = (
    videoRef: React.RefObject<HTMLVideoElement | null>,
    episodeId: string,
    isPlaying: boolean,
) => {
    const { mutate } = useSaveWatchHistory(episodeId)

    const save = useCallback(() => {
        const video = videoRef.current
        if (!video) return
        const lastWatchedSecond = Math.floor(video.currentTime)
        if (lastWatchedSecond <= 0) return
        mutate({ lastWatchedSecond })
    }, [videoRef, mutate])

    // stale closure 방지용 ref
    const saveRef = useRef(save)
    useEffect(() => {
        saveRef.current = save
    }, [save])

    // 재생 시작 시 즉시 1회, 10초 간격 반복 / 일시정지 시 즉시 1회
    useEffect(() => {
        if (!isPlaying) {
            saveRef.current()
            return
        }
        saveRef.current()
        const id = setInterval(() => saveRef.current(), SAVE_INTERVAL_MS)
        return () => clearInterval(id)
    }, [isPlaying])

    // 탭 숨김(다른 탭 전환, 앱 백그라운드) 시 저장
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) saveRef.current()
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [])

    // 페이지 닫기 / 새로고침 시 저장 (navigator.sendBeacon 사용)
    useEffect(() => {
        const handleBeforeUnload = () => {
            const video = videoRef.current
            if (!video) return
            const lastWatchedSecond = Math.floor(video.currentTime)
            if (lastWatchedSecond <= 0) return
            const url = `/api/v1/watch-history/${episodeId}`
            const blob = new Blob(
                [JSON.stringify({ lastWatchedSecond })],
                { type: 'application/json' },
            )
            navigator.sendBeacon(url, blob)
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [videoRef, episodeId])

    // 언마운트 시 1회
    useEffect(() => {
        return () => {
            saveRef.current()
        }
    }, [])

    return { save }
}
