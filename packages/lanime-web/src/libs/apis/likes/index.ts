import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { instance } from '@libs/apis/axios'
import { IApiResponse } from '@libs/types/type'
import { FavoritesResponse } from './type'
import customCookie from '@libs/customCookie'
import { AnimationDetailResponse } from '@libs/apis/animations/type'

// 좋아요 토글 (등록/취소) — optimistic update는 animationDetail 캐시에 반영
export const useToggleAnimationLike = (animationId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (currentlyLiked: boolean) => {
            if (currentlyLiked) {
                await instance.delete(`/animations/${animationId}/favorite`)
            } else {
                await instance.post(`/animations/${animationId}/favorite`)
            }
        },
        onMutate: async (currentlyLiked) => {
            await queryClient.cancelQueries({ queryKey: ['animationDetail', animationId] })
            const previous = queryClient.getQueryData<AnimationDetailResponse>(['animationDetail', animationId])

            queryClient.setQueryData<AnimationDetailResponse | undefined>(
                ['animationDetail', animationId],
                (old) => old ? { ...old, isFavorite: !currentlyLiked } : old,
            )
            return { previous }
        },
        onError: (_err, _liked, context) => {
            if (context?.previous !== undefined) {
                queryClient.setQueryData(['animationDetail', animationId], context.previous)
            }
        },
        onSettled: (_data, error) => {
            // 실패 시에는 animationDetail도 서버 상태로 복구
            if (error) {
                queryClient.invalidateQueries({ queryKey: ['animationDetail', animationId] })
            }
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
        },
    })
}

// 보관함 좋아요 탭용 무한 스크롤 목록
export const useFavoritesList = () => {
    const PAGE_SIZE = 20

    return useInfiniteQuery({
        queryKey: ['favorites'],
        queryFn: async ({ pageParam = 0 }: { pageParam?: number }) => {
            const { data } = await instance.get<IApiResponse<FavoritesResponse>>(
                '/favorites',
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
        enabled: !!customCookie.get.profileToken(),
    })
}
