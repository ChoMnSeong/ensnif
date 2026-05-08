import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useCommentsQuery } from '@libs/apis/comments'
import { CommentInput } from './CommentInput'
import { CommentItem } from './CommentItem'

export const CommentSection = ({ episodeId }: { episodeId: string }) => {
    const { t } = useTranslation()
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useCommentsQuery(episodeId)

    const comments = data?.pages.flatMap((p) => p.data.comments) ?? []
    const totalCount = data?.pages[0]?.data.totalCount ?? 0

    return (
        <View>
            <View className="px-4 pt-4 pb-3 border-b border-border-1">
                <Text className="text-fg-1 text-base font-semibold mb-3">
                    {t('comment.title', { count: totalCount })}
                </Text>
                <CommentInput episodeId={episodeId} />
            </View>
            {isLoading ? (
                <View className="py-6 items-center">
                    <ActivityIndicator color="#b473f9" />
                </View>
            ) : (
                comments.map((c) => (
                    <CommentItem
                        key={c.commentId}
                        episodeId={episodeId}
                        comment={c}
                    />
                ))
            )}
            {hasNextPage ? (
                <Pressable
                    className="py-3 items-center"
                    onPress={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    <Text className="text-primary text-sm">
                        {isFetchingNextPage
                            ? t('comment.loading')
                            : t('comment.loadMore')}
                    </Text>
                </Pressable>
            ) : null}
        </View>
    )
}
