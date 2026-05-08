import { useState } from 'react'
import { View, Text } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { Screen } from '@components/common/Screen'
import { Header } from '@components/common/Header'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { useResetProfilePinMutation } from '@libs/apis/auth'

export default function ResetPinPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const params = useLocalSearchParams<{
        profileId?: string
        profileName?: string
    }>()
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const reset = useResetProfilePinMutation()

    const onSubmit = async () => {
        if (!params.profileId) return
        try {
            await reset.mutateAsync({
                profileId: params.profileId,
                request: { password },
            })
            Toast.show({ type: 'success', text1: t('settings.pinDeleteSuccess') })
            router.back()
        } catch {
            setError(t('settings.pinDeleteFailed'))
        }
    }

    return (
        <Screen>
            <Header title={t('auth.resetPin')} />
            <View className="px-5 pt-6 flex-1">
                <Text className="text-fg-2 text-sm mb-2">
                    {t('auth.resetPinDesc', {
                        profileName: params.profileName ?? '',
                    })}
                </Text>
                <Text className="text-fg-3 text-xs mb-4">
                    {t('auth.resetPinDesc2')}
                </Text>
                <Input
                    label={t('auth.accountPassword')}
                    placeholder={t('auth.accountPasswordPlaceholder')}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />
                {error ? (
                    <Text className="text-destructive text-xs mb-2">{error}</Text>
                ) : null}
                <Button onPress={onSubmit} loading={reset.isPending}>
                    {t('auth.resetPin')}
                </Button>
            </View>
        </Screen>
    )
}
