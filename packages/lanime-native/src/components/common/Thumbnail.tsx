import { Image } from 'expo-image'
import { Pressable, Text, View } from 'react-native'

interface Props {
    uri?: string | null
    title?: string
    width?: number
    aspect?: number
    onPress?: () => void
    rank?: number
    badge?: string
}

export const Thumbnail = ({
    uri,
    title,
    width = 140,
    aspect = 2 / 3,
    onPress,
    rank,
    badge,
}: Props) => {
    const height = width / aspect
    return (
        <Pressable onPress={onPress} className="mr-3" style={{ width }}>
            <View
                style={{ width, height }}
                className="rounded-lg overflow-hidden bg-bg-el2"
            >
                {uri ? (
                    <Image
                        source={{ uri }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                        transition={200}
                    />
                ) : null}
                {rank !== undefined ? (
                    <View className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded">
                        <Text className="text-white text-xs font-bold">
                            #{rank}
                        </Text>
                    </View>
                ) : null}
                {badge ? (
                    <View className="absolute bottom-2 left-2 bg-primary px-2 py-0.5 rounded">
                        <Text className="text-white text-[10px] font-semibold">
                            {badge}
                        </Text>
                    </View>
                ) : null}
            </View>
            {title ? (
                <Text
                    className="text-fg-1 text-sm mt-2"
                    numberOfLines={2}
                >
                    {title}
                </Text>
            ) : null}
        </Pressable>
    )
}
