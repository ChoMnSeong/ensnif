import { AnimeStatus, AnimeType } from '@libs/constants/anime'

export interface AnimationResponse {
    id: string
    title: string
    thumbnailUrl: string
    type: AnimeType
    ageRating: string
    rank?: number
}

export interface WeeklyAnimationResponse {
    [key: string]: AnimationResponse[]
}

export type Animation = AnimationResponse

export type RankingType =
    | 'REALTIME'
    | 'Q1'
    | 'Q2'
    | 'Q3'
    | 'Q4'
    | 'LAST_YEAR'
    | 'ALL'

export interface RankingAnimation {
    rank: number
    id: string
    title: string
    thumbnailUrl: string
    type: AnimeType
    ageRating: string
    averageScore: number
    reviewCount: number
}

export interface EpisodeDetail {
    id: string
    title: string
    number: number
    thumbnail_url: string
    description: string
}

export interface AnimationDetailResponse {
    id: string
    title: string
    description: string
    thumbnailUrl: string
    type: AnimeType
    genres: string[]
    ageRating: string
    status: AnimeStatus
    isFavorite: boolean
}

export interface Review {
    reviewId: string
    profileId: string
    rating: number
    comment: string
    createdAt: string
    updateAt: string
    profileName: string
    avatarURL: string
}

export interface RatingCount {
    rating: number
    count: number
}

export interface AnimationReviewRatingsResponse {
    averageRating: number
    ratingCounts: RatingCount[]
    reviews: Review[]
    totalCount: number
}

export interface EpisodeResponse {
    episodeId: string
    episodeNumber: number
    title: string
    description: string
    videoUrl: string
    thumbnailUrl: string
    duration: number | null
    lastWatchedSecond: number
    isFinished: boolean
}

export interface SearchAnimationItem {
    id: string
    title: string
    thumbnailUrl: string
    type: AnimeType
    genres: string[]
    ageRating: string
    status: AnimeStatus
    airDay: string
    releasedAt: string
}

export interface AnimationGenre {
    genreId: string
    name: string
}

export interface AnimationType {
    typeId: string
    name: string
}

export interface SearchParams {
    query?: string
    typeIds?: string[]
    statuses?: string[]
    genreIds?: string[]
    startYear?: number
    endYear?: number
}
