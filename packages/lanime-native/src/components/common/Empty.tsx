import { Text, View } from 'react-native'

interface Props {
    message: string
    minHeight?: number
}

// Default minHeight matches a standard portrait anime card
// (width 140 × aspect 2/3 = 210 + ~36 for title)
export const Empty = ({ message, minHeight = 246 }: Props) => (
    <View
        className="items-center justify-center px-4"
        style={{ minHeight, flex: 1 }}
    >
        <Text className="text-fg-3">{message}</Text>
    </View>
)
