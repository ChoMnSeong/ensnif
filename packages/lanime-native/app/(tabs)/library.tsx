import { useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { Screen } from '@components/common/Screen'
import { AppHeader } from '@components/common/AppHeader'
import { Empty } from '@components/common/Empty'
import { useWatchHistoryList } from '@libs/apis/library'
import { useFavoritesList } from '@libs/apis/likes'

type Tab = 'history' | 'likes'

export default function LibraryPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const [tab, setTab] = useState<Tab>('history')

    const { data: historyData } = useWatchHistoryList()
    const { data: favoritesData } = useFavoritesList()

    const history =
        historyData?.pages?.flatMap((p) => p.data?.episodes ?? []) ?? []
    const favorites =
        favoritesData?.pages?.flatMap((p) => p.data?.animations ?? []) ?? []

    return (
        <Screen>
            <AppHeader title={t('library.title')} />
            <View className="px-4 pt-4 pb-2">
                <Text className="text-fg-1 text-2xl font-bold">
                    {t('library.title')}
                </Text>
            </View>

            <View className="flex-row border-b border-border-1 mx-4">
                {(
                    [
                        { key: 'history' as const, label: t('library.watchHistory') },
                        { key: 'likes' as const, label: t('library.likes') },
                    ]
                ).map((it) => (
                    <Pressable
                        key={it.key}
                        onPress={() => setTab(it.key)}
                        className="flex-1 py-3 items-center"
                    >
                        <Text
                            className={
                                tab === it.key
                                    ? 'text-primary font-semibold'
                                    : 'text-fg-3'
                            }
                        >
                            {it.label}
                        </Text>
                        {tab === it.key ? (
                            <View className="absolute bottom-0 h-0.5 w-full bg-primary" />
                        ) : null}
                    </Pressable>
                ))}
            </View>

            {tab === 'history' ? (
                history.length === 0 ? (
                    <Empty message={t('library.emptyHistory')} />
                ) : (
                    <FlatList
                        data={history}
                        keyExtractor={(it) => it.episodeId}
                        contentContainerStyle={{ padding: 16 }}
                        renderItem={({ item }) => (
                            <Pressable
                                className="flex-row mb-4"
                                onPress={() =>
                                    router.push(
                                        `/player/${item.animationId}/${item.episodeId}` as never,
                                    )
                                }
                            >
                                <View className="w-32 aspect-video rounded-lg overflow-hidden bg-bg-el2">
                                    <Image
                                        source={{ uri: item.thumbnailUrl }}
                                        style={{ width: '100%', height: '100%' }}
                                        contentFit="cover"
                                    />
                                </View>
                                <View className="flex-1 ml-3 justify-center">
                                    <Text
                                        className="text-fg-1 font-semibold"
                                        numberOfLines={1}
                                    >
                                        {item.animationTitle}
                                    </Text>
                                    <Text
                                        className="text-fg-3 text-sm mt-1"
                                        numberOfLines={1}
                                    >
                                        {t('library.episode', {
                                            number: item.episodeNumber,
                                        })}
                                    </Text>
                                    {item.isFinished ? (
                                        <Text className="text-success text-xs mt-1">
                                            {t('library.finished')}
                                        </Text>
                                    ) : null}
                                </View>
                            </Pressable>
                        )}
                    />
                )
            ) : favorites.length === 0 ? (
                <Empty message={t('library.emptyLikes')} />
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(it) => it.animationId}
                    numColumns={3}
                    contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 12 }}
                    columnWrapperStyle={{ gap: 8, marginBottom: 12 }}
                    renderItem={({ item }) => (
                        <Pressable
                            className="flex-1"
                            onPress={() =>
                                router.push(
                                    `/player/${item.animationId}/first` as never,
                                )
                            }
                        >
                            <View className="aspect-[2/3] rounded-lg overflow-hidden bg-bg-el2">
                                <Image
                                    source={{ uri: item.thumbnailUrl }}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="cover"
                                />
                            </View>
                            <Text
                                className="text-fg-1 text-xs mt-2"
                                numberOfLines={2}
                            >
                                {item.title}
                            </Text>
                        </Pressable>
                    )}
                />
            )}
        </Screen>
    )
}
