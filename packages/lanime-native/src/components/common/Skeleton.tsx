import { useEffect, useRef } from 'react'
import { Animated, View, ViewStyle } from 'react-native'

interface Props {
    width?: number | string
    height?: number | string
    borderRadius?: number
    style?: ViewStyle
}

export const Skeleton = ({
    width = '100%',
    height = 16,
    borderRadius = 6,
    style,
}: Props) => {
    const opacity = useRef(new Animated.Value(0.4)).current

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.85,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.4,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ]),
        )
        loop.start()
        return () => loop.stop()
    }, [opacity])

    return (
        <Animated.View
            style={[
                {
                    width: width as number,
                    height: height as number,
                    borderRadius,
                    backgroundColor: '#2E2E2E',
                    opacity,
                },
                style,
            ]}
        />
    )
}

export const ThumbnailSkeleton = ({ width = 140, aspect = 2 / 3 }: { width?: number; aspect?: number }) => {
    const height = width / aspect
    return (
        <View style={{ width, marginRight: 12 }}>
            <Skeleton width={width} height={height} borderRadius={8} />
            <View style={{ height: 8 }} />
            <Skeleton width={width * 0.85} height={12} />
            <View style={{ height: 4 }} />
            <Skeleton width={width * 0.6} height={10} />
        </View>
    )
}

export const SkeletonRow = ({
    count = 5,
    width,
    aspect,
}: {
    count?: number
    width?: number
    aspect?: number
}) => (
    <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
        {Array.from({ length: count }).map((_, i) => (
            <ThumbnailSkeleton key={i} width={width} aspect={aspect} />
        ))}
    </View>
)
