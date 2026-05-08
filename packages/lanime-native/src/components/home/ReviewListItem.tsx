import { Text, View } from 'react-native'
import { Image } from 'expo-image'
import { StarRating } from '@components/common/StarRating'
import { Review } from '@libs/apis/animations/type'

const formatDate = (iso?: string) => {
    if (!iso) return ''
    try {
        return new Date(iso).toLocaleDateString()
    } catch {
        return iso.slice(0, 10)
    }
}

export const ReviewListItem = ({ review }: { review: Review }) => {
    const updated =
        review.updateAt && review.updateAt !== review.createdAt ? true : false
    return (
        <View className="px-4 py-3 border-b border-border-1">
            <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 rounded-full overflow-hidden bg-bg-el2">
                    {review.avatarURL ? (
                        <Image
                            source={{ uri: review.avatarURL }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    ) : null}
                </View>
                <View className="ml-2 flex-1">
                    <Text className="text-fg-1 text-sm font-semibold">
                        {review.profileName ?? 'anonymous'}
                    </Text>
                    <Text className="text-fg-4 text-[10px]">
                        {formatDate(review.createdAt)}
                        {updated ? ' · 수정됨' : ''}
                    </Text>
                </View>
                <StarRating value={review.rating} size={14} readOnly />
            </View>
            {review.comment ? (
                <Text className="text-fg-2 text-sm leading-5">
                    {review.comment}
                </Text>
            ) : null}
        </View>
    )
}
