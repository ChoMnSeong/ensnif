import { AnimeStatus, AnimeType } from '@libs/constants/anime'

export interface FavoriteAnimation {
    animationId: string
    title: string
    thumbnailUrl: string
    type: AnimeType
    status: AnimeStatus
    favoritedAt: string
}

export interface FavoritesResponse {
    animations: FavoriteAnimation[]
    total: number
    page: number
    limit: number
    totalPages: number
}
