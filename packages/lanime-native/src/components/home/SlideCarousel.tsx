import { useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, Pressable, View } from 'react-native'
import { Image } from 'expo-image'
import { AdListResponse } from '@libs/apis/ad/type'

interface Props {
    items: AdListResponse[]
    autoPlayMs?: number
}

export const SlideCarousel = ({ items, autoPlayMs = 5000 }: Props) => {
    const { width } = Dimensions.get('window')
    const height = Math.round((width * 9) / 16)
    const listRef = useRef<FlatList<AdListResponse>>(null)
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (!items.length || autoPlayMs <= 0) return
        const id = setInterval(() => {
            setIndex((prev) => {
                const next = (prev + 1) % items.length
                listRef.current?.scrollToIndex({ index: next, animated: true })
                return next
            })
        }, autoPlayMs)
        return () => clearInterval(id)
    }, [items.length, autoPlayMs])

    if (!items.length) {
        return <View style={{ width, height, backgroundColor: '#0c0c0c' }} />
    }

    return (
        <View style={{ width, height }}>
            <FlatList
                ref={listRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={items}
                keyExtractor={(it) => it.id}
                getItemLayout={(_, i) => ({
                    length: width,
                    offset: width * i,
                    index: i,
                })}
                onMomentumScrollEnd={(e) => {
                    const next = Math.round(
                        e.nativeEvent.contentOffset.x / width,
                    )
                    setIndex(next)
                }}
                renderItem={({ item }) => (
                    <View style={{ width, height }}>
                        <Image
                            source={{ uri: item.webImageURL }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                        />
                        <View
                            pointerEvents="none"
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.25)',
                            }}
                        />
                        {item.logoImageURL ? (
                            <View
                                pointerEvents="none"
                                style={{
                                    position: 'absolute',
                                    left: 16,
                                    bottom: 24,
                                    width: '50%',
                                    height: '40%',
                                }}
                            >
                                <Image
                                    source={{ uri: item.logoImageURL }}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="contain"
                                />
                            </View>
                        ) : null}
                    </View>
                )}
            />
            <View
                pointerEvents="box-none"
                style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 0,
                    right: 0,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 6,
                }}
            >
                {items.map((_, i) => (
                    <Pressable
                        key={i}
                        onPress={() => {
                            listRef.current?.scrollToIndex({
                                index: i,
                                animated: true,
                            })
                            setIndex(i)
                        }}
                        style={{
                            width: i === index ? 18 : 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor:
                                i === index ? '#FAFAF8' : 'rgba(255,255,255,0.5)',
                        }}
                    />
                ))}
            </View>
        </View>
    )
}
