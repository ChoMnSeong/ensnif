import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { instance } from '../axios'
import {
    AnimationDetailResponse,
    WeeklyAnimationResponse,
    AnimationReviewRatingsResponse,
} from './type'

export const useWeeklyAnimationList = ({ airDay }: { airDay?: string }) => {
    const response = async () => {
        const { data } = await instance.get<WeeklyAnimationResponse>(
            'animation/weekly',
            {
                params: { airDay },
            },
        )
        return data.data
    }
    return useQuery({
        queryKey: ['weeklyAnimationList', airDay],
        queryFn: response,
    })
}

export const useAnimationDetail = (animationId: string) => {
    const response = async () => {
        const { data } = await instance.get<AnimationDetailResponse>(
            `animation/${animationId}`,
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
        const { data } = await instance.get<AnimationReviewRatingsResponse>(
            `/animation/${animationId}/ratings`,
            {
                params: {
                    page: pageParam,
                    limit: PAGE_SIZE,
                },
            },
        )

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
