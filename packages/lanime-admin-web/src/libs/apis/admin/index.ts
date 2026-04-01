import api from '@/libs/axios'

// --- Admin Accounts ---

export interface IAdminAccount {
    adminId: string
    email: string
    createdAt: string
}

export const getAdminAccounts = async (): Promise<IAdminAccount[]> => {
    const res = await api.get<{ success: boolean; data: IAdminAccount[] }>('/admin/accounts')
    return res.data.data
}

export const createAdminAccount = async (data: { email: string; password: string }): Promise<void> => {
    await api.post('/admin/accounts', data)
}

export const deleteAdminAccount = async (adminId: string): Promise<void> => {
    await api.delete(`/admin/accounts/${adminId}`)
}

// --- Animation Metadata ---

export interface IAnimationType {
    typeId: string
    name: string
}

export interface IAnimationGenre {
    genreId: string
    name: string
}

export const getAnimationTypes = async (): Promise<IAnimationType[]> => {
    const res = await api.get<{ success: boolean; data: IAnimationType[] }>('/animations/types')
    return res.data.data
}

export const createAnimationType = async (name: string): Promise<void> => {
    await api.post('/admin/animations/types', { name })
}

export const getAnimationGenres = async (): Promise<IAnimationGenre[]> => {
    const res = await api.get<{ success: boolean; data: IAnimationGenre[] }>('/animations/genres')
    return res.data.data
}

export const createAnimationGenre = async (name: string): Promise<void> => {
    await api.post('/admin/animations/genres', { name })
}

// --- Animations ---

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
    genres: string[] // string[] (names)
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

export const getAnimations = async (): Promise<IAdminAnimation[]> => {
    const res = await api.get<{ success: boolean; data: IAdminAnimation[] }>('/animations')
    return res.data.data
}

export const getAnimationDetail = async (id: string): Promise<IAdminAnimationDetail> => {
    const res = await api.get<{ success: boolean; data: IAdminAnimationDetail }>(`/animations/${id}`)
    return res.data.data
}

export const createAnimation = async (data: IAnimationCreateRequest): Promise<void> => {
    await api.post('/admin/animations', data)
}

export const updateAnimation = async (
    animationId: string,
    data: Partial<IAnimationCreateRequest>,
): Promise<void> => {
    await api.patch(`/admin/animations/${animationId}`, data)
}

export const deleteAnimation = async (animationId: string): Promise<void> => {
    await api.delete(`/admin/animations/${animationId}`)
}

// --- Episodes ---

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

export const getEpisodes = async (animationId: string): Promise<IAdminEpisode[]> => {
    const res = await api.get<{ success: boolean; data: IAdminEpisode[] }>(
        `/animations/${animationId}/episodes`,
    )
    return res.data.data
}

export const createEpisode = async (animationId: string, data: IEpisodeCreateRequest): Promise<void> => {
    await api.post(`/admin/animations/${animationId}/episodes`, data)
}

export const updateEpisode = async (
    episodeId: string,
    data: Partial<IEpisodeCreateRequest>,
): Promise<void> => {
    await api.patch(`/admin/episodes/${episodeId}`, data)
}

export const deleteEpisode = async (episodeId: string): Promise<void> => {
    await api.delete(`/admin/episodes/${episodeId}`)
}

// --- Video & Encoding ---

export interface IEncodingStatus {
    episodeId: string
    status: 'PENDING' | 'ENCODING' | 'COMPLETED' | 'FAILED'
    progress: number | null
    hlsPath?: string
}

export const uploadEpisodeVideo = async (
    episodeId: string,
    file: File,
    onProgress?: (pct: number) => void,
): Promise<void> => {
    const formData = new FormData()
    formData.append('file', file)
    await api.post(`/admin/episodes/${episodeId}/video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
            if (onProgress && e.total) {
                onProgress(Math.round((e.loaded / e.total) * 100))
            }
        },
    })
}

export const getEncodingStatus = async (episodeId: string): Promise<IEncodingStatus> => {
    const res = await api.get<{ success: boolean; data: IEncodingStatus }>(
        `/admin/episodes/${episodeId}/encoding-status`,
    )
    return res.data.data
}
