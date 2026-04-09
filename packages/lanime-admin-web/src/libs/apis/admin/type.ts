export interface IAdminAccount {
    adminId: string
    email: string
    createdAt: string
}

export interface IAnimationType {
    typeId: string
    name: string
}

export interface IAnimationGenre {
    genreId: string
    name: string
}

export interface IAdminAnimation {
    id: string
    title: string
    thumbnailUrl: string
    type: string
    ageRating: string
    status: string
    airDay: string | null
    releasedAt: string
}

export interface IAdminAnimationDetail extends IAdminAnimation {
    description: string
    genres: string[]
    rating?: string
}

export interface IAnimationCreateRequest {
    typeId: string
    title: string
    description: string
    thumbnailUrl: string
    rating: string
    status: string
    airDay?: string
    releasedAt: string
    genreIds: string[]
}

export interface IAdminEpisode {
    episodeId: string
    episodeNumber: number
    title: string
    thumbnailUrl: string
    description: string
    duration: number
    videoUrl: string | null
}

export interface IEpisodeCreateRequest {
    episodeNumber: number
    title: string
    thumbnailUrl: string
    description: string
    duration: number
}

export interface IEncodingStatus {
    episodeId: string
    status: 'PENDING' | 'ENCODING' | 'COMPLETED' | 'FAILED'
    progress: number | null
    hlsPath?: string
}

export interface IAdBanner {
    adBannerId: string
    title: string
    imageUrl: string
    logoImageUrl: string | null
    startAt: string | null
    endAt: string | null
    isActive: boolean
}

export interface IBannerCreateRequest {
    title: string
    imageUrl: string
    logoImageUrl?: string
    startAt?: string
    endAt?: string
    isActive?: boolean
}

export type IBannerUpdateRequest = Partial<IBannerCreateRequest>

export interface ITranslationRequest {
    title: string
    description?: string
}

export interface IMalImportRequest {
    malId: number
}

export interface ISeasonImportRequest {
    season?: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL'
    year?: number
}

export interface IBulkResetImportRequest {
    startYear?: number
    endYear?: number
}
