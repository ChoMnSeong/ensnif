import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useSimilarAnimations } from '@libs/apis/animations'
import { openModal } from '@stores/episodeModal'

interface Props {
    animationId: string
}

export const EpisodeModalSimilarTab = ({ animationId }: Props) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useSimilarAnimations(animationId)

    const items = data?.pages.flatMap((p) => p.data) ?? []

    if (isLoading) {
        return (
            <View className="py-10 items-center">
                <ActivityIndicator color="#b473f9" />
            </View>
        )
    }

    if (!items.length) {
        return (
            <View className="py-10 items-center">
                <Text className="text-fg-3">{t('search.noResults')}</Text>
            </View>
        )
    }

    return (
        <View className="px-4">
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                {items.map((it) => (
                    <Pressable
                        key={it.id}
                        style={{ width: '32%' }}
                        onPress={() =>
                            dispatch(
                                openModal({
                                    animationId: it.id,
                                    title: it.title,
                                }),
                            )
                        }
                    >
                        <View className="aspect-[2/3] rounded-md overflow-hidden bg-bg-el2">
                            <Image
                                source={{ uri: it.thumbnailUrl }}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                            />
                        </View>
                        <Text
                            className="text-fg-1 text-xs mt-1"
                            numberOfLines={2}
                        >
                            {it.title}
                        </Text>
                    </Pressable>
                ))}
            </View>
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
