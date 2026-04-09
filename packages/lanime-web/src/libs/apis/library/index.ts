import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { instance } from '@libs/apis/axios'
import { IApiResponse } from '@/libs/types/type'
import { WatchHistoryResponse } from './type'

export const useSaveWatchHistory = (episodeId: string) => {
    return useMutation({
        mutationFn: async ({ lastWatchedSecond }: { lastWatchedSecond: number }) => {
            const { data } = await instance.put<IApiResponse<null>>(
                `/watch-history/${episodeId}`,
                { lastWatchedSecond },
            )
            return data
        },
    })
}

export const useWatchHistoryList = () => {
    const PAGE_SIZE = 20

    return useInfiniteQuery({
        queryKey: ['watchHistory'],
        queryFn: async ({ pageParam = 0 }: { pageParam?: number }) => {
            const { data } = await instance.get<IApiResponse<WatchHistoryResponse>>(
                '/watch-history',
                { params: { page: pageParam, limit: PAGE_SIZE } },
            )
            const totalPages = data.data?.totalPages ?? 1
            return {
                data: data.data,
                nextPage: pageParam + 1 < totalPages ? pageParam + 1 : undefined,
            }
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    })
}
