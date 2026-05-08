import { useState } from 'react'
import { View, Text } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { AuthLayout } from '@components/auth/AuthLayout'
import {
    useSendVerificationMutation,
    useVerifyCodeMutation,
    useSignupMutation,
} from '@libs/apis/auth'

const PASSWORD_RE =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/

export default function SignUpPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const params = useLocalSearchParams<{ email?: string }>()

    const [email] = useState(params.email ?? '')
    const [code, setCode] = useState('')
    const [verified, setVerified] = useState(false)
    const [password, setPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [error, setError] = useState<string | null>(null)

    const sendVerification = useSendVerificationMutation()
    const verifyCode = useVerifyCodeMutation()
    const signup = useSignupMutation()

    const onSendCode = async () => {
        setError(null)
        try {
            await sendVerification.mutateAsync({ email })
            Toast.show({ type: 'success', text1: t('auth.sendCode') })
        } catch {
            setError(t('auth.codeSendFailed'))
        }
    }

    const onVerify = async () => {
        setError(null)
        if (code.length !== 5) {
            setError(t('auth.codeInvalid'))
            return
        }
        try {
            const ok = await verifyCode.mutateAsync({ email, code })
            if (ok) setVerified(true)
            else setError(t('auth.codeMismatch'))
        } catch {
            setError(t('auth.codeVerifyFailed'))
        }
    }

    const onSubmit = async () => {
        setError(null)
        if (!password || !nickname) {
            setError(t('auth.signupFieldsRequired'))
            return
        }
        if (!PASSWORD_RE.test(password)) {
            setError(t('auth.passwordFormatError'))
            return
        }
        if (nickname.length < 2 || nickname.length > 10) {
            setError(t('auth.nicknameFormatError'))
            return
        }
        try {
            await signup.mutateAsync({ email, password, nickname })
            Toast.show({ type: 'success', text1: t('auth.signupComplete') })
            router.replace('/auth/mail')
        } catch {
            setError(t('auth.signupError'))
        }
    }

    return (
        <AuthLayout
            title={t('auth.signup')}
            subtitle={t('auth.confirmSignupDesc')}
        >
            <Input label={t('auth.email')} value={email} editable={false} />

            {!verified ? (
                <>
                    <View className="flex-row" style={{ gap: 8 }}>
                        <View className="flex-1">
                            <Input
                                label={t('auth.verificationCode')}
                                placeholder={t('auth.codePlaceholder')}
                                value={code}
                                onChangeText={setCode}
                                keyboardType="number-pad"
                                maxLength={5}
                            />
                        </View>
                        <View className="mb-3 mt-7">
                            <Button
                                variant="secondary"
                                onPress={onSendCode}
                                loading={sendVerification.isPending}
                            >
                                {t('auth.resend')}
                            </Button>
                        </View>
                    </View>
                    {error ? (
                        <Text className="text-destructive text-xs mb-2">
                            {error}
                        </Text>
                    ) : null}
                    <Button onPress={onVerify} loading={verifyCode.isPending}>
                        {t('auth.verifyCode')}
                    </Button>
                </>
            ) : (
                <>
                    <Input
                        label={t('auth.password')}
                        placeholder={t('auth.passwordPlaceholder')}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    <Input
                        label={t('auth.nickname')}
                        placeholder={t('auth.nicknamePlaceholder')}
                        value={nickname}
                        onChangeText={setNickname}
                        maxLength={10}
                    />
                    {error ? (
                        <Text className="text-destructive text-xs mb-2">
                            {error}
                        </Text>
                    ) : null}
                    <Button onPress={onSubmit} loading={signup.isPending}>
                        {t('auth.signupComplete')}
                    </Button>
                </>
            )}
        </AuthLayout>
    )
}
