import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useAnimationEpisodes } from '@libs/apis/animations'

interface Props {
    animationId: string
    onAfterSelect?: () => void
}

export const EpisodeModalEpisodesTab = ({
    animationId,
    onAfterSelect,
}: Props) => {
    const { t } = useTranslation()
    const router = useRouter()
    const { data: episodes, isLoading } = useAnimationEpisodes(animationId)

    if (isLoading) {
        return (
            <View className="py-10 items-center">
                <ActivityIndicator color="#b473f9" />
            </View>
        )
    }

    return (
        <View className="px-4">
            {(episodes ?? []).map((ep) => (
                <Pressable
                    key={ep.episodeId}
                    className="flex-row mb-3 p-2 rounded-lg bg-bg-el2"
                    onPress={() => {
                        onAfterSelect?.()
                        router.push(
                            `/player/${animationId}/${ep.episodeId}` as never,
                        )
                    }}
                >
                    <View className="w-32 aspect-video rounded-md overflow-hidden bg-bg-el3">
                        <Image
                            source={{ uri: ep.thumbnailUrl }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                        />
                    </View>
                    <View className="flex-1 ml-3 justify-center">
                        <Text className="text-fg-1 font-semibold" numberOfLines={1}>
                            {ep.episodeNumber}. {ep.title}
                        </Text>
                        {ep.description ? (
                            <Text
                                className="text-fg-3 text-xs mt-1"
                                numberOfLines={2}
                            >
                                {ep.description}
                            </Text>
                        ) : null}
                        {ep.isFinished ? (
                            <Text className="text-success text-xs mt-1">
                                {t('player.finished')}
                            </Text>
                        ) : null}
                    </View>
                </Pressable>
            ))}
        </View>
    )
}
