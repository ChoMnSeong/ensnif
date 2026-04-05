import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import instance from "@libs/api/axios";
import type {
    IAdminAccount,
    IAdminAnimation,
    IAdminAnimationDetail,
    IAnimationCreateRequest,
    IAnimationType,
    IAnimationGenre,
    IAdminEpisode,
    IEpisodeCreateRequest,
    IEncodingStatus,
    IAdBanner,
    IBannerCreateRequest,
    IBannerUpdateRequest,
} from '@libs/apis/admin/type'

interface IApiResponse<T> {
    success: boolean
    data: T
}

// --- Admin Accounts ---

export const useAdminAccounts = () =>
    useQuery({
        queryKey: ['admin', 'accounts'],
        queryFn: async () => {
            const res = await instance.get<IApiResponse<IAdminAccount[]>>('/admin/accounts')
            return res.data.data
        },
    })

export const useCreateAdminAccount = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            await instance.post('/admin/accounts', data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] })
        },
    })
}

export const useDeleteAdminAccount = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (adminId: string) => {
            await instance.delete(`/admin/accounts/${adminId}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] })
        },
    })
}

// --- Animation Metadata ---

export const useAnimationTypes = () =>
    useQuery({
        queryKey: ['admin', 'types'],
        queryFn: async () => {
            const res = await instance.get<IApiResponse<IAnimationType[]>>('/animations/types')
            return res.data.data
        },
    })

export const useCreateAnimationType = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (name: string) => {
            await instance.post('/admin/animations/types', { name })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'types'] })
        },
    })
}

export const useAnimationGenres = () =>
    useQuery({
        queryKey: ['admin', 'genres'],
        queryFn: async () => {
            const res = await instance.get<IApiResponse<IAnimationGenre[]>>('/animations/genres')
            return res.data.data
        },
    })

export const useCreateAnimationGenre = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (name: string) => {
            await instance.post('/admin/animations/genres', { name })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'genres'] })
        },
    })
}

// --- Animations ---

export const useAdminAnimations = () =>
    useQuery({
        queryKey: ['admin', 'animations'],
        queryFn: async () => {
            const res = await instance.get<IApiResponse<IAdminAnimation[]>>('/animations')
            return res.data.data
        },
    })

export const fetchAnimationDetail = async (id: string): Promise<IAdminAnimationDetail> => {
    const res = await instance.get<IApiResponse<IAdminAnimationDetail>>(`/animations/${id}`)
    return res.data.data
}

export const useCreateAnimation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: IAnimationCreateRequest) => {
            await instance.post('/admin/animations', data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'animations'] })
        },
    })
}

export const useUpdateAnimation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<IAnimationCreateRequest> }) => {
            await instance.patch(`/admin/animations/${id}`, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'animations'] })
        },
    })
}

export const useDeleteAnimation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (animationId: string) => {
            await instance.delete(`/admin/animations/${animationId}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'animations'] })
        },
    })
}

// --- Episodes ---

export const useEpisodes = (animationId: string | undefined) =>
    useQuery({
        queryKey: ['admin', 'episodes', animationId],
        queryFn: async () => {
            const res = await instance.get<IApiResponse<IAdminEpisode[]>>(
                `/animations/${animationId}/episodes`,
            )
            return res.data.data
        },
        enabled: !!animationId,
    })

export const useCreateEpisode = (animationId: string | undefined) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: IEpisodeCreateRequest) => {
            await instance.post(`/admin/animations/${animationId}/episodes`, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'episodes', animationId] })
        },
    })
}

export const useUpdateEpisode = (animationId: string | undefined) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<IEpisodeCreateRequest> }) => {
            await instance.patch(`/admin/episodes/${id}`, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'episodes', animationId] })
        },
    })
}

export const useDeleteEpisode = (animationId: string | undefined) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (episodeId: string) => {
            await instance.delete(`/admin/episodes/${episodeId}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'episodes', animationId] })
        },
    })
}

// --- Video & Encoding ---

export const useEncodingStatus = (episodeId: string) =>
    useQuery({
        queryKey: ['admin', 'encoding', episodeId],
        queryFn: async () => {
            const res = await instance.get<IApiResponse<IEncodingStatus>>(
                `/admin/episodes/${episodeId}/encoding-status`,
            )
            return res.data.data
        },
        refetchInterval: (query) => {
            const status = query.state.data?.status
            return status === 'ENCODING' || status === 'PENDING' ? 3000 : false
        },
        retry: false,
    })

// --- Ad Banners ---

export const useAdBanners = () =>
    useQuery({
        queryKey: ['admin', 'banners'],
        queryFn: async () => {
            const res = await instance.get<IApiResponse<IAdBanner[]>>('/admin/banners')
            return res.data.data
        },
    })

export const useCreateAdBanner = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: IBannerCreateRequest) => {
            const res = await instance.post<IApiResponse<IAdBanner>>('/admin/banners', data)
            return res.data.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] })
        },
    })
}

export const useUpdateAdBanner = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: IBannerUpdateRequest }) => {
            const res = await instance.patch<IApiResponse<IAdBanner>>(`/admin/banners/${id}`, data)
            return res.data.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] })
        },
    })
}

export const useDeleteAdBanner = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (bannerId: string) => {
            await instance.delete(`/admin/banners/${bannerId}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] })
        },
    })
}

export const uploadEpisodeVideo = async (
    episodeId: string,
    file: File,
    onProgress?: (pct: number) => void,
): Promise<void> => {
    const formData = new FormData()
    formData.append('file', file)
    await instance.post(`/admin/episodes/${episodeId}/video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
            if (onProgress && e.total) {
                onProgress(Math.round((e.loaded / e.total) * 100))
            }
        },
    })
}
