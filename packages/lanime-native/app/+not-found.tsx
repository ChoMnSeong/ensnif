import { View, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Screen } from '@components/common/Screen'
import { Button } from '@components/common/Button'

export default function NotFoundPage() {
    const { t } = useTranslation()
    const router = useRouter()

    return (
        <Screen>
            <View className="flex-1 items-center justify-center px-6">
                <Text className="text-fg-1 text-3xl font-bold mb-2">404</Text>
                <Text className="text-fg-3 text-sm mb-6">Page not found</Text>
                <Button onPress={() => router.replace('/')}>
                    {t('notFound.goBack')}
                </Button>
            </View>
        </Screen>
    )
}
