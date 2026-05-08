import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { UserMenu } from './UserMenu'

interface Props {
    title?: string
    onBack?: () => void
}

export const AppHeader = ({ title = 'lanime', onBack }: Props) => {
    return (
        <View className="flex-row items-center justify-between h-14 px-4 bg-bg-page border-b border-border-1">
            <View className="flex-row items-center flex-1">
                {onBack ? (
                    <Pressable
                        onPress={onBack}
                        hitSlop={10}
                        className="mr-2"
                    >
                        <Ionicons
                            name="chevron-back"
                            size={26}
                            color="#FAFAF8"
                        />
                    </Pressable>
                ) : null}
                <Text
                    className="text-fg-1 text-lg font-bold"
                    numberOfLines={1}
                >
                    {title}
                </Text>
            </View>
            <UserMenu />
        </View>
    )
}
