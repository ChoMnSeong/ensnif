import { useCallback, useEffect, useState } from 'react'

/**
 * 메인 플레이어가 화면 밖으로 스크롤되면 우측 하단 미니(PiP) 플레이어를 노출시킨다.
 *
 * - sentinelRef: 원래 플레이어 자리를 차지하는 래퍼 엘리먼트.
 *   공간을 유지(레이아웃 점프 방지)하면서 가시성 감지 대상이 된다.
 * - enabled: 재생이 시작된 이후에만 동작하도록 하는 게이트.
 */
export const usePictureInPicture = (
    sentinelRef: React.RefObject<HTMLElement | null>,
    enabled: boolean,
) => {
    const [outOfView, setOutOfView] = useState(false)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel || !enabled) {
            setOutOfView(false)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setOutOfView(!entry.isIntersecting)
                // 다시 화면 안으로 들어오면 '닫기' 상태를 초기화한다.
                if (entry.isIntersecting) setDismissed(false)
            },
            { threshold: 0 },
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [sentinelRef, enabled])

    const dismiss = useCallback(() => setDismissed(true), [])

    return { isPiP: enabled && outOfView && !dismissed, dismiss }
}
