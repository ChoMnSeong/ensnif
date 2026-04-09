export interface WatchHistoryEpisode {
    episodeId: string
    episodeNumber: number
    title: string
    thumbnailUrl: string
    duration: number
    animationId: string
    animationTitle: string
    lastWatchedSecond: number
    isFinished: boolean
    watchedAt: string
}

export interface WatchHistoryResponse {
    episodes: WatchHistoryEpisode[]
    total: number
    page: number
    limit: number
    totalPages: number
}
