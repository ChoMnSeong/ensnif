import { useState } from 'react'
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@libs/hooks/useAppDispatch'
import { setModalVisibility } from '@stores/episodeModal'
import { useAnimationDetail } from '@libs/apis/animations'
import { AnimePreview } from './AnimePreview'
import { EpisodeModalEpisodesTab } from './EpisodeModalEpisodesTab'
import { EpisodeModalReviewsTab } from './EpisodeModalReviewsTab'
import { EpisodeModalSimilarTab } from './EpisodeModalSimilarTab'

type TabKey = 'episodes' | 'reviews' | 'similar'

export const AnimeEpisodeModal = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { visible, animationId } = useAppSelector((s) => s.episodeModal)
    const [tab, setTab] = useState<TabKey>('episodes')
    const { data: detail } = useAnimationDetail(animationId ?? '')

    const close = () => dispatch(setModalVisibility(false))

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={close}
        >
            <View className="flex-1 bg-bg-page">
                <View className="flex-row items-center justify-end px-2 pt-2">
                    <Pressable onPress={close} hitSlop={12} className="p-2">
                        <Ionicons name="close" size={24} color="#FAFAF8" />
                    </Pressable>
                </View>
                <ScrollView>
                    {detail ? <AnimePreview animation={detail} /> : null}
                    <View className="flex-row border-b border-border-1 mt-4 mx-4">
                        {(
                            [
                                {
                                    key: 'episodes' as const,
                                    label: t('modal.episodes'),
                                },
                                {
                                    key: 'reviews' as const,
                                    label: t('modal.reviews'),
                                },
                                {
                                    key: 'similar' as const,
                                    label: t('modal.similar'),
                                },
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
                    <View className="py-4">
                        {animationId ? (
                            tab === 'episodes' ? (
                                <EpisodeModalEpisodesTab
                                    animationId={animationId}
                                    onAfterSelect={close}
                                />
                            ) : tab === 'reviews' ? (
                                <EpisodeModalReviewsTab
                                    animationId={animationId}
                                />
                            ) : (
                                <EpisodeModalSimilarTab
                                    animationId={animationId}
                                />
                            )
                        ) : null}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}
