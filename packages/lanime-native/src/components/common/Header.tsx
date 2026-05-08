import { View, Text, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useRouter } from 'expo-router'

interface Props {
    title?: string
    showBack?: boolean
    rightIcon?: keyof typeof Ionicons.glyphMap
    onPressRight?: () => void
}

export const Header = ({
    title,
    showBack = true,
    rightIcon,
    onPressRight,
}: Props) => {
    const r = useRouter()
    return (
        <View className="flex-row items-center justify-between h-14 px-4 border-b border-border-1 bg-bg-el1">
            <View className="flex-row items-center flex-1">
                {showBack ? (
                    <Pressable
                        onPress={() => (r.canGoBack() ? r.back() : router.replace('/'))}
                        hitSlop={12}
                        className="mr-2"
                    >
                        <Ionicons name="chevron-back" size={26} color="#FAFAF8" />
                    </Pressable>
                ) : null}
                {title ? (
                    <Text
                        className="text-fg-1 text-lg font-semibold"
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                ) : null}
            </View>
            {rightIcon ? (
                <Pressable onPress={onPressRight} hitSlop={12}>
                    <Ionicons name={rightIcon} size={24} color="#FAFAF8" />
                </Pressable>
            ) : null}
        </View>
    )
}
