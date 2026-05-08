import { Pressable, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface Props {
    value: number
    onChange?: (value: number) => void
    size?: number
    readOnly?: boolean
    color?: string
}

export const StarRating = ({
    value,
    onChange,
    size = 28,
    readOnly,
    color = '#FFC34D',
}: Props) => {
    return (
        <View style={{ flexDirection: 'row', gap: 2 }}>
            {[1, 2, 3, 4, 5].map((i) => {
                const filled = i <= Math.round(value)
                const Icon = (
                    <Ionicons
                        name={filled ? 'star' : 'star-outline'}
                        size={size}
                        color={color}
                    />
                )
                if (readOnly || !onChange) return <View key={i}>{Icon}</View>
                return (
                    <Pressable
                        key={i}
                        onPress={() => onChange(i)}
                        hitSlop={4}
                    >
                        {Icon}
                    </Pressable>
                )
            })}
        </View>
    )
}
