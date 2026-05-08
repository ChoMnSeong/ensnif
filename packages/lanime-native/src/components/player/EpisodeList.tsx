import { Pressable, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { EpisodeResponse } from '@libs/apis/animations/type'

interface Props {
    episodes: EpisodeResponse[]
    currentEpisodeId?: string
    onSelect: (ep: EpisodeResponse) => void
}

export const EpisodeList = ({ episodes, currentEpisodeId, onSelect }: Props) => {
    const { t } = useTranslation()

    return (
        <View className="p-4">
            <Text className="text-fg-1 text-base font-semibold mb-3">
                {t('player.episodeList')}
            </Text>
            {episodes.map((item) => {
                const isActive = item.episodeId === currentEpisodeId
                return (
                    <Pressable
                        key={item.episodeId}
                        className={`flex-row mb-3 p-2 rounded-lg ${
                            isActive ? 'bg-bg-el2' : ''
                        }`}
                        onPress={() => onSelect(item)}
                    >
                        <View className="w-28 aspect-video rounded-md overflow-hidden bg-bg-el2">
                            <Image
                                source={{ uri: item.thumbnailUrl }}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                            />
                        </View>
                        <View className="flex-1 ml-3 justify-center">
                            <Text
                                className={
                                    isActive
                                        ? 'text-primary font-semibold'
                                        : 'text-fg-1 font-semibold'
                                }
                                numberOfLines={1}
                            >
                                {item.episodeNumber}. {item.title}
                            </Text>
                            {item.isFinished ? (
                                <Text className="text-success text-xs mt-1">
                                    {t('player.finished')}
                                </Text>
                            ) : null}
                        </View>
                    </Pressable>
                )
            })}
        </View>
    )
}
