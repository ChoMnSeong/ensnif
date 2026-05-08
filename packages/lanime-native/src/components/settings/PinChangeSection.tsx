import { useState } from 'react'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { Button } from '@components/common/Button'
import { PinInput } from '@components/auth/PinInput'
import { useUpdateProfileMutation } from '@libs/apis/auth'

export const PinChangeSection = () => {
    const { t } = useTranslation()
    const [pin, setPin] = useState('')
    const update = useUpdateProfileMutation()

    const apply = async () => {
        if (pin.length !== 4) return
        try {
            await update.mutateAsync({ pin })
            Toast.show({ type: 'success', text1: t('settings.saveSuccess') })
            setPin('')
        } catch {
            Toast.show({ type: 'error', text1: t('settings.saveFailed') })
        }
    }

    return (
        <View className="mb-6">
            <Text className="text-fg-1 text-base font-semibold mb-3">
                {t('settings.changePin')}
            </Text>
            <Text className="text-fg-3 text-xs mb-3">
                {t('settings.changePinDesc')}
            </Text>
            <View className="mb-3">
                <PinInput value={pin} onChange={setPin} autoFocus={false} />
            </View>
            <Button onPress={apply} loading={update.isPending}>
                {t('common.save')}
            </Button>
        </View>
    )
}
