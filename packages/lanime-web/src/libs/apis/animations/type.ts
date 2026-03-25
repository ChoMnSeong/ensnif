import { AnimeType } from '../../constants/anime'
import { CommonResponse } from '../../types/type'

export interface Animation {
    id: string
    title: string
    thumbnailURL: string
    type: AnimeType
    ageRating: string
}

export interface WeeklyAnimationResponse extends CommonResponse {
    data: Animation[]
}

export interface EpisodeDetail {
    id: string
    title: string
    number: number
    thumbnail_url: string
    description: string
}

export interface AnimationDetail {
    id: string
    title: string
    description: string
    thumbnailURL: string
    type: string
    genres: string[]
    ageRating: string
    status: string
}

export interface AnimationDetailResponse extends CommonResponse {
    data: AnimationDetail
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

export interface AnimationReviewRatingsData {
    averageRating: number
    ratingCounts: RatingCount[]
    reviews: Review[]
    totalCount: number
}

export interface AnimationReviewRatingsResponse extends CommonResponse {
    data: AnimationReviewRatingsData
}
