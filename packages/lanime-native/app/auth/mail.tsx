import { useState } from 'react'
import {
    View,
    Text,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { Screen } from '@components/common/Screen'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import {
    useCheckEmailMutation,
    useSigninMutation,
} from '@libs/apis/auth'

export default function MailPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [step, setStep] = useState<'email' | 'password'>('email')
    const [error, setError] = useState<string | null>(null)

    const checkEmail = useCheckEmailMutation()
    const signin = useSigninMutation()

    const onContinue = async () => {
        setError(null)
        if (step === 'email') {
            if (!email.trim()) return
            try {
                const res = await checkEmail.mutateAsync({ email })
                if (res?.isRegistered) {
                    setStep('password')
                } else {
                    router.push({
                        pathname: '/auth/signup',
                        params: { email },
                    })
                }
            } catch {
                setError(t('auth.serverError'))
            }
            return
        }

        if (!password) return
        try {
            await signin.mutateAsync({ email, password })
            router.replace('/profile')
        } catch {
            setError(t('auth.loginFailed'))
        }
    }

    const isLoading = checkEmail.isPending || signin.isPending
    const buttonDisabled =
        step === 'email' ? !email.trim() : !password || isLoading

    return (
        <Screen>
            <View className="flex-row items-center px-2 h-12">
                <Pressable
                    onPress={() =>
                        router.canGoBack() ? router.back() : router.replace('/')
                    }
                    hitSlop={12}
                    className="p-2"
                >
                    <Ionicons name="chevron-back" size={26} color="#FAFAF8" />
                </Pressable>
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
                    <View className="items-center pt-6 pb-8">
                        <Text className="text-fg-1 text-3xl font-bold mb-2">
                            lanime
                        </Text>
                        <Text className="text-fg-3 text-sm">
                            {t('auth.emailStart')}
                        </Text>
                    </View>

                    <View className="bg-bg-el1 rounded-2xl px-5 py-6 border border-border-1">
                        <Input
                            label={t('auth.emailLabel')}
                            placeholder={t('auth.emailPlaceholderLogin')}
                            value={email}
                            onChangeText={(v) => {
                                setEmail(v)
                                if (step === 'password') setStep('email')
                            }}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            autoComplete="email"
                            returnKeyType="next"
                        />
                        {step === 'password' ? (
                            <Input
                                label={t('auth.passwordLabel')}
                                placeholder={t('auth.passwordPlaceholderLogin')}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                                autoComplete="password"
                                returnKeyType="done"
                                onSubmitEditing={onContinue}
                            />
                        ) : null}

                        {error ? (
                            <Text className="text-destructive text-xs mb-3">
                                {error}
                            </Text>
                        ) : null}

                        <Button
                            onPress={onContinue}
                            loading={isLoading}
                            disabled={buttonDisabled}
                        >
                            {isLoading
                                ? t('common.processing')
                                : t('auth.next')}
                        </Button>

                        {step === 'password' ? (
                            <Pressable
                                className="mt-4 self-center"
                                hitSlop={6}
                                onPress={() =>
                                    router.push('/auth/forgot-password')
                                }
                            >
                                <Text className="text-fg-3 text-xs">
                                    {t('auth.forgotPasswordLink')}
                                </Text>
                            </Pressable>
                        ) : null}
                    </View>

                    <View className="mt-6 items-center">
                        <Text className="text-fg-4 text-[11px] text-center leading-4">
                            로그인하면 lanime 서비스 이용약관 및{'\n'}
                            개인정보 처리방침에 동의한 것으로 간주됩니다.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    )
}
