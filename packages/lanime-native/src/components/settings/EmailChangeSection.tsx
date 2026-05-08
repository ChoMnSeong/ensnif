import { useState } from 'react'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import {
    useChangeEmailMutation,
    useSendEmailVerificationMutation,
} from '@libs/apis/auth'

export const EmailChangeSection = ({
    currentEmail,
}: {
    currentEmail?: string
}) => {
    const { t } = useTranslation()
    const [newEmail, setNewEmail] = useState('')
    const [code, setCode] = useState('')
    const [stage, setStage] = useState<'send' | 'verify'>('send')
    const sendCode = useSendEmailVerificationMutation()
    const change = useChangeEmailMutation()

    const onSend = async () => {
        if (!newEmail) return
        try {
            await sendCode.mutateAsync({ email: newEmail })
            setStage('verify')
            Toast.show({ type: 'success', text1: t('settings.emailCodeSent') })
        } catch {
            Toast.show({ type: 'error', text1: t('settings.emailCodeFailed') })
        }
    }

    const onChange = async () => {
        try {
            await change.mutateAsync({ newEmail, verificationCode: code })
            Toast.show({ type: 'success', text1: t('settings.emailChanged') })
            setNewEmail('')
            setCode('')
            setStage('send')
        } catch {
            Toast.show({
                type: 'error',
                text1: t('settings.emailChangeFailed'),
            })
        }
    }

    return (
        <View className="mb-6">
            <Text className="text-fg-1 text-base font-semibold mb-3">
                {t('settings.changeEmail')}
            </Text>
            {currentEmail ? (
                <Text className="text-fg-3 text-xs mb-2">
                    {t('settings.currentEmail')}: {currentEmail}
                </Text>
            ) : null}
            <Input
                label={t('settings.newEmail')}
                placeholder={t('settings.newEmailPlaceholder')}
                value={newEmail}
                onChangeText={setNewEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={stage === 'send'}
            />
            {stage === 'verify' ? (
                <Input
                    label={t('settings.verificationCode')}
                    placeholder={t('settings.verificationCodePlaceholder')}
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                />
            ) : null}
            {stage === 'send' ? (
                <Button onPress={onSend} loading={sendCode.isPending}>
                    {t('settings.sendCode')}
                </Button>
            ) : (
                <Button onPress={onChange} loading={change.isPending}>
                    {t('settings.changeEmail')}
                </Button>
            )}
        </View>
    )
}
