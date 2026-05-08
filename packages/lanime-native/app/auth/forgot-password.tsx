import { useState } from 'react'
import { View, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { AuthLayout } from '@components/auth/AuthLayout'
import {
    useForgotPasswordMutation,
    useResetPasswordMutation,
} from '@libs/apis/auth'

export default function ForgotPasswordPage() {
    const { t } = useTranslation()
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [token, setToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [stage, setStage] = useState<'request' | 'reset'>('request')
    const [error, setError] = useState<string | null>(null)

    const forgot = useForgotPasswordMutation()
    const reset = useResetPasswordMutation()

    const onSendCode = async () => {
        setError(null)
        try {
            await forgot.mutateAsync({ email })
            setStage('reset')
        } catch {
            setError(t('auth.codeSendFailed'))
        }
    }

    const onReset = async () => {
        setError(null)
        if (newPassword !== confirmPassword) {
            setError(t('auth.passwordMismatch'))
            return
        }
        try {
            await reset.mutateAsync({ email, token, newPassword })
            Toast.show({ type: 'success', text1: t('auth.changePassword') })
            router.replace('/auth/mail')
        } catch {
            setError(t('auth.serverError'))
        }
    }

    return (
        <AuthLayout
            title={t('auth.forgotPassword')}
            subtitle={
                stage === 'request' ? t('auth.forgotPasswordDesc') : undefined
            }
        >
            {stage === 'request' ? (
                <>
                    <Input
                        label={t('auth.email')}
                        placeholder={t('auth.emailPlaceholder')}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    {error ? (
                        <Text className="text-destructive text-xs mb-2">
                            {error}
                        </Text>
                    ) : null}
                    <Button onPress={onSendCode} loading={forgot.isPending}>
                        {t('auth.sendResetCode')}
                    </Button>
                </>
            ) : (
                <>
                    <Input
                        label={t('auth.verificationToken')}
                        placeholder={t('auth.tokenPlaceholder')}
                        value={token}
                        onChangeText={setToken}
                    />
                    <Input
                        label={t('auth.newPassword')}
                        placeholder={t('auth.newPasswordPlaceholder')}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    <Input
                        label={t('auth.confirmPassword')}
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    {error ? (
                        <Text className="text-destructive text-xs mb-2">
                            {error}
                        </Text>
                    ) : null}
                    <Button onPress={onReset} loading={reset.isPending}>
                        {t('auth.resetPassword')}
                    </Button>
                </>
            )}
        </AuthLayout>
    )
}
