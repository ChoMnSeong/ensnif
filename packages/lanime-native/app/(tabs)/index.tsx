import { ScrollView, View, Text, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { Screen } from '@components/common/Screen'
import { AppHeader } from '@components/common/AppHeader'
import { Section } from '@components/common/Section'
import { Thumbnail } from '@components/common/Thumbnail'
import { Empty } from '@components/common/Empty'
import { SkeletonRow } from '@components/common/Skeleton'
import { SlideCarousel } from '@components/home/SlideCarousel'
import { RankingTypeTabs } from '@components/home/RankingTypeTabs'
import {
    useAnimationRankings,
    useAllWeeklyAnimations,
} from '@libs/apis/animations'
import { useWatchHistoryList } from '@libs/apis/library'
import { useAdvertiseList } from '@libs/apis/ad'
import { RankingType } from '@libs/apis/animations/type'
import { openModal } from '@stores/episodeModal'
import tokenStorage from '@libs/tokenStorage'

export default function HomePage() {
    const { t } = useTranslation()
    const router = useRouter()
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const [refreshing, setRefreshing] = useState(false)
    const [rankingType, setRankingType] = useState<RankingType>('REALTIME')

    const {
        data: rankings,
        isLoading: rankingsLoading,
        error: rankingsError,
    } = useAnimationRankings(rankingType)
    const { data: weekly, isLoading: weeklyLoading } = useAllWeeklyAnimations()
    const { data: historyData } = useWatchHistoryList()
    const { data: ads } = useAdvertiseList()

    const isLoggedIn = !!tokenStorage.get.profileToken()
    const watchHistory =
        historyData?.pages?.flatMap((p) => p.data?.episodes ?? []) ?? []

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['animationRankings'] }),
            queryClient.invalidateQueries({ queryKey: ['weeklyAnimationList'] }),
            queryClient.invalidateQueries({ queryKey: ['watchHistory'] }),
            queryClient.invalidateQueries({ queryKey: ['ad'] }),
        ])
        setRefreshing(false)
    }, [queryClient])

    const goPlayer = (animeId: string, episodeId: string) =>
        router.push(`/player/${animeId}/${episodeId}` as never)

    const openEpisode = (animationId: string, title: string) => {
        dispatch(openModal({ animationId, title }))
    }

    const weeklyDays = Object.entries(weekly ?? {})

    return (
        <Screen>
            <AppHeader />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#b473f9"
                    />
                }
            >
                <SlideCarousel items={ads ?? []} />

                {rankingsError ? (
                    <View className="mx-4 mt-4 p-3 rounded-lg border border-destructive bg-bg-el2">
                        <Text className="text-destructive font-semibold mb-1">
                            네트워크 오류
                        </Text>
                        <Text className="text-fg-3 text-xs" selectable>
                            {(rankingsError as Error)?.message ?? 'Unknown error'}
                        </Text>
                    </View>
                ) : null}

                {isLoggedIn && watchHistory.length > 0 ? (
                    <View className="mt-6">
                        <Section title={t('home.continueWatching')}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 16 }}
                            >
                                {watchHistory.slice(0, 12).map((ep) => (
                                    <Thumbnail
                                        key={ep.episodeId}
                                        uri={ep.thumbnailUrl}
                                        title={`${ep.animationTitle} · ${t(
                                            'library.episode',
                                            { number: ep.episodeNumber },
                                        )}`}
                                        width={220}
                                        aspect={16 / 9}
                                        onPress={() =>
                                            goPlayer(ep.animationId, ep.episodeId)
                                        }
                                    />
                                ))}
                            </ScrollView>
                        </Section>
                    </View>
                ) : null}

                <View className="mt-2">
                    <Section title={t('home.popularAnime')}>
                        <View className="mb-3">
                            <RankingTypeTabs
                                selected={rankingType}
                                onSelect={setRankingType}
                            />
                        </View>
                        {rankingsLoading ? (
                            <SkeletonRow count={5} />
                        ) : !rankings?.length ? (
                            <Empty
                                message={
                                    rankingsError
                                        ? '데이터를 불러오지 못했습니다'
                                        : '데이터가 없습니다'
                                }
                            />
                        ) : (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 16 }}
                            >
                                {rankings.map((item) => (
                                    <Thumbnail
                                        key={item.id}
                                        uri={item.thumbnailUrl}
                                        title={item.title}
                                        rank={item.rank}
                                        badge={item.type}
                                        onPress={() =>
                                            openEpisode(item.id, item.title)
                                        }
                                    />
                                ))}
                            </ScrollView>
                        )}
                    </Section>
                </View>

                <Section title={t('home.weeklyAnime')}>
                    {weeklyLoading ? (
                        <SkeletonRow count={5} />
                    ) : weeklyDays.length === 0 ? (
                        <Empty message={t('weekly.noData')} />
                    ) : (
                        weeklyDays.map(([day, list]) => (
                            <View key={day} className="mb-4">
                                <Text className="text-fg-2 text-sm font-semibold px-4 mb-2">
                                    {t(`airDay.${day}`, day)}
                                </Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        paddingHorizontal: 16,
                                    }}
                                >
                                    {list.map((item) => (
                                        <Thumbnail
                                            key={item.id}
                                            uri={item.thumbnailUrl}
                                            title={item.title}
                                            badge={item.type}
                                            onPress={() =>
                                                openEpisode(item.id, item.title)
                                            }
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                        ))
                    )}
                </Section>
            </ScrollView>
        </Screen>
    )
}
