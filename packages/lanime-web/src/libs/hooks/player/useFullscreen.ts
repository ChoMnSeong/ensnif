import { useCallback } from 'react'

interface WebkitElement extends HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>
}

interface WebkitDocument extends Document {
    webkitExitFullscreen?: () => Promise<void>
}

export const useFullscreen = (
    containerRef: React.RefObject<HTMLDivElement | null>,
) => {
    const toggleFullscreen = useCallback(() => {
        const doc = document as WebkitDocument
        const container = containerRef.current as WebkitElement | null

        if (document.fullscreenElement) {
            void (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.())
        } else {
            void (
                container?.requestFullscreen?.() ??
                container?.webkitRequestFullscreen?.()
            )
        }
    }, [containerRef])

    return { toggleFullscreen }
}
