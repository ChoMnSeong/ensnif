import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { AnimationDetailResponse } from '@libs/apis/animations/type'
import { useToggleAnimationLike } from '@libs/apis/likes'

interface Props {
    animation: AnimationDetailResponse
}

const Tag = ({ children }: { children: React.ReactNode }) => (
    <View
        style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.18)',
        }}
    >
        <Text className="text-white text-[11px] font-medium">{children}</Text>
    </View>
)

export const AnimePreview = ({ animation }: Props) => {
    const { t } = useTranslation()
    const [expanded, setExpanded] = useState(false)
    const toggleLike = useToggleAnimationLike(animation.id)
    const liked = !!animation.isFavorite

    const description = animation.description?.replace(/<br\s*\/?>/gi, '\n')

    return (
        <View>
            {/* Hero with blurred backdrop */}
            <View
                style={{
                    width: '100%',
                    aspectRatio: 16 / 9,
                    backgroundColor: '#1A1A1A',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <Image
                    source={{ uri: animation.thumbnailUrl }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                    contentFit="cover"
                    blurRadius={30}
                />
                <BlurView
                    intensity={40}
                    tint="dark"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                />
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                    }}
                />

                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Image
                        source={{ uri: animation.thumbnailUrl }}
                        style={{ width: '70%', height: '88%' }}
                        contentFit="contain"
                    />
                </View>

                <View
                    pointerEvents="none"
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 50,
                        backgroundColor: 'rgba(26,26,26,0.7)',
                    }}
                />
            </View>

            {/* Info */}
            <View className="px-4 pt-4 pb-2">
                <Text
                    className="text-fg-1 text-2xl font-bold mb-3"
                    numberOfLines={2}
                >
                    {animation.title}
                </Text>

                <View className="flex-row flex-wrap mb-3" style={{ gap: 6 }}>
                    <Tag>
                        {t(`animationStatus.${animation.status}`, animation.status)}
                    </Tag>
                    <Tag>
                        {t(`animationType.${animation.type}`, animation.type)}
                    </Tag>
                    {animation.ageRating ? (
                        <Tag>{animation.ageRating}+</Tag>
                    ) : null}
                </View>

                {animation.genres?.length ? (
                    <View
                        className="flex-row flex-wrap mb-4"
                        style={{ gap: 6 }}
                    >
                        {animation.genres.map((g) => (
                            <Tag key={g}>{t(`genre.${g}`, g)}</Tag>
                        ))}
                    </View>
                ) : null}

                {description ? (
                    <View className="mb-4">
                        <Text
                            className="text-fg-2 text-sm leading-6"
                            numberOfLines={expanded ? undefined : 3}
                        >
                            {description}
                        </Text>
                        <Pressable
                            onPress={() => setExpanded((v) => !v)}
                            className="self-end mt-1"
                            hitSlop={6}
                        >
                            <Text className="text-fg-3 text-xs font-semibold">
                                {expanded ? t('home.less') : t('home.more')}
                            </Text>
                        </Pressable>
                    </View>
                ) : null}

                <Pressable
                    onPress={() => toggleLike.mutate(liked)}
                    className={`flex-row items-center self-start px-4 h-10 rounded-full border ${
                        liked
                            ? 'border-destructive bg-destructive/10'
                            : 'border-border-2 bg-bg-el2'
                    }`}
                >
                    <Ionicons
                        name={liked ? 'heart' : 'heart-outline'}
                        size={18}
                        color={liked ? '#FF6B6B' : '#FAFAF8'}
                    />
                    <Text
                        className={`text-xs font-semibold ml-2 ${
                            liked ? 'text-destructive' : 'text-fg-1'
                        }`}
                    >
                        {liked ? t('home.unlike') : t('home.like')}
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}
