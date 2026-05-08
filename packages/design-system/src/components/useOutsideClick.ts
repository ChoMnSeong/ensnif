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
        document.addEventListener('touchstart', handler)
        return () => {
            document.removeEventListener('mousedown', handler)
            document.removeEventListener('touchstart', handler)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, onOutside])
}
