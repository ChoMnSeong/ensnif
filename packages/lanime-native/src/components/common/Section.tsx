import { ReactNode } from 'react'
import { Text, View } from 'react-native'

interface Props {
    title: string
    children: ReactNode
    actionLabel?: string
    onAction?: () => void
}

export const Section = ({ title, children }: Props) => {
    return (
        <View className="mb-6">
            <View className="px-4 mb-3">
                <Text className="text-fg-1 text-lg font-bold">{title}</Text>
            </View>
            <View>{children}</View>
        </View>
    )
}
