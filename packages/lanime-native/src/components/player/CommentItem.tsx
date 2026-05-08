import { useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@libs/hooks/useAppDispatch'
import { IComment } from '@libs/apis/comments/type'
import {
    useDeleteCommentMutation,
    useRepliesQuery,
} from '@libs/apis/comments'
import { CommentInput } from './CommentInput'

const formatDate = (iso?: string) => {
    if (!iso) return ''
    try {
        return new Date(iso).toLocaleDateString()
    } catch {
        return iso.slice(0, 10)
    }
}

interface Props {
    episodeId: string
    comment: IComment
    isReply?: boolean
}

export const CommentItem = ({ episodeId, comment, isReply }: Props) => {
    const { t } = useTranslation()
    const myProfileId = useAppSelector((s) => s.userProfile.profileId)
    const [showReply, setShowReply] = useState(false)
    const [showReplies, setShowReplies] = useState(false)

    const delMut = useDeleteCommentMutation(episodeId)

    const repliesQuery = useRepliesQuery(
        episodeId,
        comment.commentId,
        showReplies,
    )
    const replies =
        repliesQuery.data?.pages.flatMap((p) => p.data.comments) ?? []

    const isMine = myProfileId === comment.profileId
    const padding = isReply ? 'pl-12' : 'pl-0'

    return (
        <View className={`px-4 py-3 border-b border-border-1 ${padding}`}>
            <View className="flex-row items-center mb-1">
                <View className="w-7 h-7 rounded-full overflow-hidden bg-bg-el2">
                    {comment.avatarUrl ? (
                        <Image
                            source={{ uri: comment.avatarUrl }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    ) : null}
                </View>
                <View className="ml-2 flex-1">
                    <Text className="text-fg-1 text-sm font-semibold">
                        {comment.profileName}
                    </Text>
                    <Text className="text-fg-4 text-[10px]">
                        {formatDate(comment.createdAt)}
                    </Text>
                </View>
                {isMine ? (
                    <Pressable
                        onPress={() => delMut.mutate(comment.commentId)}
                        hitSlop={6}
                    >
                        <Text className="text-destructive text-xs">
                            {t('common.delete')}
                        </Text>
                    </Pressable>
                ) : null}
            </View>
            <Text className="text-fg-2 text-sm leading-5">
                {comment.content}
            </Text>

            {!isReply ? (
                <View className="flex-row mt-2 gap-3">
                    <Pressable onPress={() => setShowReply((v) => !v)}>
                        <Text className="text-primary text-xs">
                            {t('comment.reply')}
                        </Text>
                    </Pressable>
                    {comment.replyCount > 0 ? (
                        <Pressable
                            onPress={() => setShowReplies((v) => !v)}
                        >
                            <Text className="text-fg-3 text-xs">
                                {showReplies
                                    ? t('comment.hideReplies')
                                    : t('comment.replyCount', {
                                          count: comment.replyCount,
                                      })}
                            </Text>
                        </Pressable>
                    ) : null}
                </View>
            ) : null}

            {showReply ? (
                <View className="mt-2">
                    <CommentInput
                        episodeId={episodeId}
                        parentCommentId={comment.commentId}
                        placeholder={t('comment.replyPlaceholder')}
                        onSubmitted={() => {
                            setShowReply(false)
                            setShowReplies(true)
                        }}
                    />
                </View>
            ) : null}

            {showReplies ? (
                <View className="mt-2">
                    {repliesQuery.isLoading ? (
                        <ActivityIndicator color="#b473f9" />
                    ) : (
                        replies.map((r) => (
                            <CommentItem
                                key={r.commentId}
                                episodeId={episodeId}
                                comment={r}
                                isReply
                            />
                        ))
                    )}
                    {repliesQuery.hasNextPage ? (
                        <Pressable
                            className="py-2 items-center"
                            onPress={() => repliesQuery.fetchNextPage()}
                        >
                            <Text className="text-primary text-xs">
                                {t('comment.loadMoreReplies')}
                            </Text>
                        </Pressable>
                    ) : null}
                </View>
            ) : null}
        </View>
    )
}
