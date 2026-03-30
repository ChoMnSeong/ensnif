import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { instance } from '@libs/apis/axios'
import { IApiResponse } from '@/libs/types/type'
import {
    IComment,
    ICommentListResponse,
    ICreateCommentRequest,
    IUpdateCommentRequest,
} from './type'

const COMMENT_LIMIT = 20

const parseComments = (raw: unknown): IComment[] => {
    if (!raw) return []
    if (Array.isArray(raw)) return raw as IComment[]
    const obj = raw as Record<string, unknown>
    const list = obj.comments ?? obj.replies ?? obj.content ?? obj.data ?? []
    return Array.isArray(list) ? (list as IComment[]) : []
}

const parseTotalCount = (raw: unknown, comments: IComment[]): number => {
    if (!raw || typeof raw !== 'object') return comments.length
    const obj = raw as Record<string, unknown>
    return (obj.totalCount ?? obj.total ?? obj.totalElements ?? comments.length) as number
}

export const useCommentsQuery = (episodeId: string) => {
    return useInfiniteQuery({
        queryKey: ['episodeComments', episodeId],
        queryFn: async ({ pageParam = 0 }) => {
            const { data } = await instance.get(
                `episodes/${episodeId}/comments`,
                { params: { page: pageParam, limit: COMMENT_LIMIT } },
            )
            const raw = data.data
            const comments = parseComments(raw)
            const totalCount = parseTotalCount(raw, comments)
            const hasMore = comments.length >= COMMENT_LIMIT
            return {
                data: { comments, totalCount, page: pageParam, limit: COMMENT_LIMIT } as ICommentListResponse,
                nextPage: hasMore ? pageParam + 1 : undefined,
            }
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        enabled: !!episodeId,
    })
}

export const useRepliesQuery = (episodeId: string, commentId: string, enabled: boolean) => {
    return useInfiniteQuery({
        queryKey: ['episodeReplies', episodeId, commentId],
        queryFn: async ({ pageParam = 0 }) => {
            const { data } = await instance.get(
                `episodes/${episodeId}/comments/${commentId}/replies`,
                { params: { page: pageParam, limit: COMMENT_LIMIT } },
            )
            const raw = data.data
            const comments = parseComments(raw)
            const totalCount = parseTotalCount(raw, comments)
            const hasMore = comments.length >= COMMENT_LIMIT
            return {
                data: { comments, totalCount, page: pageParam, limit: COMMENT_LIMIT } as ICommentListResponse,
                nextPage: hasMore ? pageParam + 1 : undefined,
            }
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        enabled: !!episodeId && enabled,
    })
}

export const useCreateCommentMutation = (episodeId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (body: ICreateCommentRequest) => {
            const { data } = await instance.post<IApiResponse<IComment>>(
                `episodes/${episodeId}/comments`,
                body,
            )
            return data.data!
        },
        onSuccess: (_, variables) => {
            if (variables.parentCommentId) {
                queryClient.invalidateQueries({
                    queryKey: ['episodeReplies', episodeId, variables.parentCommentId],
                })
                queryClient.invalidateQueries({
                    queryKey: ['episodeComments', episodeId],
                })
            } else {
                queryClient.invalidateQueries({
                    queryKey: ['episodeComments', episodeId],
                })
            }
        },
    })
}

export const useUpdateCommentMutation = (episodeId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({
            commentId,
            body,
        }: {
            commentId: string
            body: IUpdateCommentRequest
        }) => {
            const { data } = await instance.patch<IApiResponse<IComment>>(
                `episodes/${episodeId}/comments/${commentId}`,
                body,
            )
            return data.data!
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['episodeComments', episodeId] })
        },
    })
}

export const useDeleteCommentMutation = (episodeId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (commentId: string) => {
            await instance.delete(`episodes/${episodeId}/comments/${commentId}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['episodeComments', episodeId] })
        },
    })
}
