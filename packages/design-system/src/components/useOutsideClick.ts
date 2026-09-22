import { useEffect, type RefObject } from 'react'

type AnyRef = RefObject<HTMLElement | null>

export const useOutsideClick = (
    refs: AnyRef | AnyRef[],
    onOutside: () => void,
    enabled = true,
) => {
    useEffect(() => {
        if (!enabled) return
        const refList = Array.isArray(refs) ? refs : [refs]
        const handler = (e: MouseEvent | TouchEvent) => {
            if (!(e.target instanceof Node)) {
                onOutside()
                return
            }
            for (const r of refList) {
                if (r.current && r.current.contains(e.target)) return
            }
            onOutside()
        }
        document.addEventListener('mousedown', handler)
        // passive: 바깥 클릭 감지만 하고 기본 동작을 막지 않으므로 터치 스크롤을 지연시키지 않는다.
        document.addEventListener('touchstart', handler, { passive: true })
        return () => {
            document.removeEventListener('mousedown', handler)
            document.removeEventListener('touchstart', handler)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, onOutside])
}
