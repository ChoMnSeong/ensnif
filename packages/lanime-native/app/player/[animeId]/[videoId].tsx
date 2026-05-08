import { useEffect, useMemo, useState } from 'react'
import { ScrollView, Text, View, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Screen } from '@components/common/Screen'
import { Empty } from '@components/common/Empty'
import { VideoPlayer } from '@components/player/VideoPlayer'
import { EpisodeList } from '@components/player/EpisodeList'
import { CommentSection } from '@components/player/CommentSection'
import {
    useAnimationDetail,
    useAnimationEpisodes,
} from '@libs/apis/animations'
import { useSaveWatchHistory } from '@libs/apis/library'
import tokenStorage from '@libs/tokenStorage'

export default function PlayerPage() {
    const { animeId, videoId } = useLocalSearchParams<{
        animeId: string
        videoId: string
    }>()
    const { t } = useTranslation()
    const router = useRouter()
    const insets = useSafeAreaInsets()

    const { data: detail } = useAnimationDetail(animeId ?? '')
    const { data: episodes } = useAnimationEpisodes(animeId ?? '')

    const isLoggedIn = !!tokenStorage.get.profileToken()

    const currentEpisode = useMemo(() => {
        if (!episodes?.length) return undefined
        if (videoId === 'first') return episodes[0]
        return episodes.find((e) => e.episodeId === videoId) ?? episodes[0]
    }, [episodes, videoId])

    const [activeEpisodeId, setActiveEpisodeId] = useState<string | undefined>(
        currentEpisode?.episodeId,
    )

    useEffect(() => {
        if (currentEpisode) setActiveEpisodeId(currentEpisode.episodeId)
    }, [currentEpisode])

    const activeEpisode = episodes?.find((e) => e.episodeId === activeEpisodeId)

    const saveHistory = useSaveWatchHistory(activeEpisode?.episodeId ?? '')

    if (!animeId) {
        return (
            <Screen>
                <Empty message={t('notFound.goBack')} />
            </Screen>
        )
    }

    if (!isLoggedIn) {
        return (
            <Screen>
                <View className="flex-1 items-center justify-center px-6">
                    <Text className="text-fg-2 text-base mb-4 text-center">
                        {t('player.loginRequired')}
                    </Text>
                    <Pressable
                        className="bg-primary px-6 h-12 rounded-xl items-center justify-center"
                        onPress={() => router.replace('/auth/mail')}
                    >
                        <Text className="text-white font-semibold">
                            {t('auth.emailStart')}
                        </Text>
                    </Pressable>
                </View>
            </Screen>
        )
    }

    return (
        <Screen safe={false}>
            <View className="bg-black" style={{ paddingTop: insets.top }}>
                <View className="flex-row items-center px-2 h-12">
                    <Pressable
                        onPress={() =>
                            router.canGoBack()
                                ? router.back()
                                : router.replace('/')
                        }
                        hitSlop={12}
                        className="p-2"
                    >
                        <Ionicons
                            name="chevron-back"
                            size={26}
                            color="#fff"
                        />
                    </Pressable>
                    <Text
                        className="text-white font-semibold flex-1 ml-1 mr-3"
                        numberOfLines={1}
                    >
                        {detail?.title ?? ''}
                    </Text>
                </View>

                {activeEpisode?.videoUrl ? (
                    <VideoPlayer
                        uri={activeEpisode.videoUrl}
                        startSeconds={activeEpisode.lastWatchedSecond ?? 0}
                        onProgress={(sec) =>
                            saveHistory.mutate({
                                lastWatchedSecond: Math.floor(sec),
                            })
                        }
                    />
                ) : (
                    <View
                        style={{
                            width: '100%',
                            aspectRatio: 16 / 9,
                            backgroundColor: '#000',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons
                            name="videocam-off-outline"
                            size={32}
                            color="#4D4D4D"
                        />
                        <Text className="text-fg-4 text-xs mt-2">
                            영상 정보를 불러오지 못했습니다
                        </Text>
                    </View>
                )}
            </View>

            <ScrollView className="flex-1">
                <View className="px-4 py-4 border-b border-border-1">
                    <Text className="text-fg-1 text-lg font-bold">
                        {detail?.title}
                    </Text>
                    <View className="flex-row mt-2 gap-2">
                        {detail?.genres?.slice(0, 3).map((g) => (
                            <View
                                key={g}
                                className="px-2 py-0.5 bg-bg-el2 rounded"
                            >
                                <Text className="text-fg-3 text-xs">
                                    {t(`genre.${g}`, g)}
                                </Text>
                            </View>
                        ))}
                    </View>
                    {detail?.description ? (
                        <Text className="text-fg-3 text-sm mt-3 leading-5">
                            {detail.description}
                        </Text>
                    ) : null}
                </View>

                <EpisodeList
                    episodes={episodes ?? []}
                    currentEpisodeId={activeEpisodeId}
                    onSelect={(ep) => setActiveEpisodeId(ep.episodeId)}
                />

                {activeEpisode?.episodeId ? (
                    <CommentSection episodeId={activeEpisode.episodeId} />
                ) : null}
            </ScrollView>
        </Screen>
    )
}
