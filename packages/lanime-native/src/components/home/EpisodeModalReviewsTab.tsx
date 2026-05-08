import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useInfiniteAnimationReview } from '@libs/apis/animations'
import { ReviewListItem } from './ReviewListItem'
import { ReviewWrite } from './ReviewWrite'

interface Props {
    animationId: string
}

export const EpisodeModalReviewsTab = ({ animationId }: Props) => {
    const { t } = useTranslation()
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteAnimationReview(animationId)

    const reviews = data?.pages.flatMap((p) => p.data.data?.reviews ?? []) ?? []
    const ratingsAvg = data?.pages[0]?.data.data?.averageRating ?? 0
    const totalCount = data?.pages[0]?.data.data?.totalCount ?? 0

    if (isLoading) {
        return (
            <View className="py-10 items-center">
                <ActivityIndicator color="#b473f9" />
            </View>
        )
    }

    return (
        <View>
            <View className="px-4 pb-3 flex-row items-center">
                <Text className="text-fg-1 text-2xl font-bold mr-2">
                    {ratingsAvg.toFixed(1)}
                </Text>
                <Text className="text-fg-3 text-xs">
                    / {t('home.totalRatings', { total: totalCount })}
                </Text>
            </View>
            <ReviewWrite animationId={animationId} />
            {reviews.map((r) => (
                <ReviewListItem key={r.reviewId} review={r} />
            ))}
            {hasNextPage ? (
                <Pressable
                    className="py-3 items-center"
                    onPress={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    <Text className="text-primary text-sm">
                        {isFetchingNextPage
                            ? t('common.loading')
                            : t('home.more')}
                    </Text>
                </Pressable>
            ) : null}
        </View>
    )
}
