import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { instance } from '@libs/apis/axios'
import { IApiResponse } from '@/libs/types/type'
import { AnimationDetailResponse, AnimationResponse, AnimationReviewRatingsResponse, EpisodeResponse, RankingAnimation, RankingType, WeeklyAnimationResponse } from './type'

export const useWeeklyAnimationList = ({ airDay }: { airDay: string }) => {
    return useQuery({
        queryKey: ['weeklyAnimationList', airDay],
        queryFn: async () => {
            const { data } = await instance.get<IApiResponse<AnimationResponse[]>>(
                'animations/weekly',
                { params: { airDay } },
            )
            return data.data ?? []
        },
    })
}

export const useAllWeeklyAnimations = () => {
    return useQuery({
        queryKey: ['weeklyAnimationList', 'all'],
        queryFn: async () => {
            const { data } = await instance.get<IApiResponse<WeeklyAnimationResponse>>(
                'animations/weekly',
            )
            return data.data ?? {}
        },
    })
}

export const useAnimationDetail = (animationId: string) => {
    const response = async () => {
        const { data } =
            await instance.get<IApiResponse<AnimationDetailResponse>>(
                `animations/${animationId}`,
            )
        return data.data
    }

    return useQuery({
        queryKey: ['animationDetail', animationId],
        queryFn: response,
        enabled: !!animationId,
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
