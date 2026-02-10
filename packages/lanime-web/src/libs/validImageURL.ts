export const validImageURL = (url?: string): boolean => {
    if (!url) return false

    try {
        const { protocol, pathname } = new URL(url)

        if (!['http:', 'https:'].includes(protocol)) return false

        const ext = pathname.split('.').pop()?.toLowerCase()
        if (!ext) return false

        const imageExtensions = [
            'jpg',
            'jpeg',
            'png',
            'gif',
            'webp',
            'bmp',
            'svg',
            'avif',
            'apng',
            'ico',
        ]

        return imageExtensions.includes(ext)
    } catch {
        return false
    }
}
