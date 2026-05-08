import { TextInput, TextInputProps, View, Text } from 'react-native'

interface Props extends TextInputProps {
    label?: string
    error?: string | null
}

export const Input = ({ label, error, className, ...rest }: Props) => {
    return (
        <View className="mb-3">
            {label ? (
                <Text className="text-fg-2 mb-1.5 text-sm">{label}</Text>
            ) : null}
            <TextInput
                placeholderTextColor="#848484"
                {...rest}
                className={`bg-bg-el2 text-fg-1 rounded-xl px-4 h-12 border border-border-1 ${className ?? ''}`}
            />
            {error ? (
                <Text className="text-destructive text-xs mt-1">{error}</Text>
            ) : null}
        </View>
    )
}
