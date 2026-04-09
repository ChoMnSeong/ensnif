import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { instance } from '@libs/apis/axios'
import { IApiResponse } from '@/libs/types/type'
import {
    AnimationDetailResponse,
    AnimationGenre,
    AnimationResponse,
    AnimationReviewRatingsResponse,
    AnimationType,
    EpisodeResponse,
    RankingAnimation,
    RankingType,
    SearchAnimationItem,
    SearchParams,
    WeeklyAnimationResponse,
} from './type'

export const useWeeklyAnimationList = ({ airDay }: { airDay: string }) => {
    return useQuery({
        queryKey: ['weeklyAnimationList', airDay],
        queryFn: async () => {
            const { data } = await instance.get<
                IApiResponse<AnimationResponse[]>
            >('animations/weekly', { params: { airDay } })
            return data.data ?? []
        },
        staleTime: 1000 * 60 * 5, // 5분
    })
}

export const useAllWeeklyAnimations = () => {
    return useQuery({
        queryKey: ['weeklyAnimationList', 'all'],
        queryFn: async () => {
            const { data } =
                await instance.get<IApiResponse<WeeklyAnimationResponse>>(
                    'animations/weekly',
                )
            return data.data ?? {}
        },
        staleTime: 1000 * 60 * 5, // 5분
    })
}

export const useAnimationDetail = (animationId: string) => {
    const response = async () => {
        const { data } = await instance.get<
            IApiResponse<AnimationDetailResponse>
        >(`animations/${animationId}`)
        return data.data
    }

    return useQuery({
        queryKey: ['animationDetail', animationId],
        queryFn: response,
        enabled: !!animationId,
        staleTime: 1000 * 60 * 10, // 10분
    })
}

export const useInfiniteAnimationReview = (animationId: string) => {
    const PAGE_SIZE = 20

    const response = async ({ pageParam = 0 }: { pageParam?: number }) => {
        const { data } = await instance.get<
            IApiResponse<AnimationReviewRatingsResponse>
        >(`/animations/${animationId}/ratings`, {
            params: {
                page: pageParam,
                limit: PAGE_SIZE,
            },
        })

        const hasMoreData = (data.data?.reviews?.length ?? 0) >= PAGE_SIZE

        return {
            data: data,
            nextPage: hasMoreData ? pageParam + 1 : undefined,
        }
    }

    return useInfiniteQuery({
        queryKey: ['animationReviews', animationId],
        queryFn: response,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 1000 * 60 * 5, // 5분
    })
}

export const useAnimationEpisodes = (animationId: string) => {
    const response = async () => {
        const { data } = await instance.get<IApiResponse<EpisodeResponse[]>>(
            `animations/${animationId}/episodes`,
        )
        return data.data
    }

    return useQuery({
        queryKey: ['animationEpisodes', animationId],
        queryFn: response,
        enabled: !!animationId,
        staleTime: 1000 * 60 * 10, // 10분
    })
}

export const useInfiniteSearchAnimations = (params: SearchParams) => {
    const PAGE_SIZE = 30

    return useInfiniteQuery({
        queryKey: [
            'searchAnimations',
            params.query,
            params.typeIds,
            params.statuses,
            params.genreIds,
            params.startYear,
            params.endYear,
        ],
        queryFn: async ({ pageParam = 0 }) => {
            const { data } = await instance.get<
                IApiResponse<SearchAnimationItem[]>
            >('/animations', {
                params: {
                    ...(params.query && { query: params.query }),
                    ...(params.typeIds?.length && {
                        typeIds: params.typeIds.join(','),
                    }),
                    ...(params.statuses?.length && {
                        statuses: params.statuses.join(','),
                    }),
                    ...(params.genreIds?.length && {
                        genreIds: params.genreIds.join(','),
                    }),
                    ...(params.startYear && { startYear: params.startYear }),
                    ...(params.endYear && { endYear: params.endYear }),
                    page: pageParam,
                    limit: PAGE_SIZE,
                },
            })
            const items = data.data ?? []
            return {
                items,
                nextPage: items.length >= PAGE_SIZE ? pageParam + 1 : undefined,
            }
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    })
}

export const useAnimationGenres = () => {
    return useQuery({
        queryKey: ['animationGenres'],
        queryFn: async () => {
            const { data } =
                await instance.get<IApiResponse<AnimationGenre[]>>(
                    '/animations/genres',
                )
            return data.data ?? []
        },
        staleTime: 1000 * 60 * 10,
    })
}

export const useAnimationTypes = () => {
    return useQuery({
        queryKey: ['animationTypes'],
        queryFn: async () => {
            const { data } =
                await instance.get<IApiResponse<AnimationType[]>>(
                    '/animations/types',
                )
            return data.data ?? []
        },
        staleTime: 1000 * 60 * 10,
    })
}

export const useAnimationRankings = (type: RankingType) => {
    const response = async () => {
        const { data } = await instance.get<IApiResponse<RankingAnimation[]>>(
            'animations/rankings',
            { params: { type } },
        )
        return data.data
    }
    return useQuery({
        queryKey: ['animationRankings', type],
        queryFn: response,
        staleTime: 1000 * 60 * 5, // 5분
    })
}

export const useCreateAnimationReview = (animationId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            rating,
            comment,
        }: {
            rating: number
            comment: string
        }) => {
            const { data } = await instance.post(
                `/animations/${animationId}/ratings`,
                { rating, comment },
            )
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['animationReviews', animationId],
            })
        },
    })
}

export const useDeleteAnimationReview = (animationId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            await instance.delete(`/animations/${animationId}/ratings`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['animationReviews', animationId],
            })
        },
    })
}

export const useUpdateAnimationReview = (animationId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            rating,
            comment,
        }: {
            rating: number
            comment: string
        }) => {
            const { data } = await instance.patch(
                `/animations/${animationId}/ratings`,
                { rating, comment },
            )
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['animationReviews', animationId],
            })
        },
    })
}

export const useSimilarAnimations = (
    animationId: string,
    matchPercentage: number = 80,
    pageSize: number = 10,
) => {
    const PAGE_SIZE = pageSize

    return useInfiniteQuery({
        queryKey: ['similarAnimations', animationId, matchPercentage],
        queryFn: async ({ pageParam = 0 }) => {
            const { data } = await instance.get<
                IApiResponse<SearchAnimationItem[]>
            >(`animations/${animationId}/similar`, {
                params: {
                    matchPercentage,
                    page: pageParam,
                    limit: PAGE_SIZE,
                },
            })
            return {
                data: data.data ?? [],
                hasMore: (data.data?.length ?? 0) >= PAGE_SIZE,
            }
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasMore ? allPages.length : undefined
        },
        enabled: !!animationId,
        staleTime: 1000 * 60 * 5, // 5분
    })
}
