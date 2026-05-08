import { ReactNode } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Screen } from '@components/common/Screen'

interface Props {
    title: string
    subtitle?: string
    children: ReactNode
    showBack?: boolean
}

export const AuthLayout = ({
    title,
    subtitle,
    children,
    showBack = true,
}: Props) => {
    const router = useRouter()
    return (
        <Screen>
            <View className="flex-row items-center px-2 h-12">
                {showBack ? (
                    <Pressable
                        onPress={() =>
                            router.canGoBack()
                                ? router.back()
                                : router.replace('/')
                        }
                        hitSlop={12}
                        className="p-2"
                    >
                        <Ionicons
                            name="chevron-back"
                            size={26}
                            color="#FAFAF8"
                        />
                    </Pressable>
                ) : null}
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 24,
                        paddingTop: 16,
                        paddingBottom: 24,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="items-center pt-4 pb-6">
                        <Text className="text-fg-1 text-2xl font-bold mb-2">
                            {title}
                        </Text>
                        {subtitle ? (
                            <Text className="text-fg-3 text-sm text-center">
                                {subtitle}
                            </Text>
                        ) : null}
                    </View>

                    <View className="bg-bg-el1 rounded-2xl px-5 py-6 border border-border-1">
                        {children}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    )
}
