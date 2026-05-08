export const isValidImageURL = (url?: string | null): boolean => {
    if (!url) return false
    return /^https?:\/\//i.test(url) || url.startsWith('file://') || url.startsWith('data:image')
}
