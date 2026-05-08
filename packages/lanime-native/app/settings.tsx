import { useState } from 'react'
import { ScrollView, View, Text, Pressable } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { Screen } from '@components/common/Screen'
import { Header } from '@components/common/Header'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { EmailChangeSection } from '@components/settings/EmailChangeSection'
import { PinChangeSection } from '@components/settings/PinChangeSection'
import { DeleteAccountModal } from '@components/settings/DeleteAccountModal'
import { useAppSelector } from '@libs/hooks/useAppDispatch'
import {
    useChangePasswordMutation,
    useDeleteAccountMutation,
    useUpdateProfileMutation,
} from '@libs/apis/auth'
import i18n from '@libs/i18n'
import tokenStorage from '@libs/tokenStorage'

const PASSWORD_RE =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/

export default function SettingsPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const profile = useAppSelector((s) => s.userProfile)

    const [nickname, setNickname] = useState(profile.nickname ?? '')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [showDelete, setShowDelete] = useState(false)

    const updateProfile = useUpdateProfileMutation()
    const changePassword = useChangePasswordMutation()
    const deleteAccount = useDeleteAccountMutation()

    const saveProfile = async () => {
        try {
            await updateProfile.mutateAsync({ name: nickname })
            Toast.show({ type: 'success', text1: t('settings.saveSuccess') })
        } catch {
            Toast.show({ type: 'error', text1: t('settings.saveFailed') })
        }
    }

    const submitPassword = async () => {
        setError(null)
        if (!PASSWORD_RE.test(newPassword)) {
            setError(t('settings.passwordFormatError'))
            return
        }
        if (newPassword !== confirmPassword) {
            setError(t('settings.passwordMismatch'))
            return
        }
        try {
            await changePassword.mutateAsync({ currentPassword, newPassword })
            Toast.show({ type: 'success', text1: t('settings.passwordChanged') })
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch {
            Toast.show({
                type: 'error',
                text1: t('settings.passwordChangeFailed'),
            })
        }
    }

    const onLogout = async () => {
        await Promise.all([
            tokenStorage.remove.accessToken(),
            tokenStorage.remove.refreshToken(),
            tokenStorage.remove.profileToken(),
        ])
        router.replace('/auth/mail')
    }

    const onDelete = async () => {
        try {
            await deleteAccount.mutateAsync()
            Toast.show({ type: 'success', text1: t('settings.accountDeleteSuccess') })
            setShowDelete(false)
            await onLogout()
        } catch {
            Toast.show({
                type: 'error',
                text1: t('settings.accountDeleteFailed'),
            })
        }
    }

    const langs: { code: string; label: string }[] = [
        { code: 'ko', label: '한국어' },
        { code: 'en', label: 'English' },
        { code: 'ja', label: '日本語' },
    ]

    return (
        <Screen>
            <Header title={t('settings.title')} />
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
                <View className="items-center mb-6">
                    <View className="w-24 h-24 rounded-full overflow-hidden bg-bg-el2">
                        {profile.avatarUrl ? (
                            <Image
                                source={{ uri: profile.avatarUrl }}
                                style={{ width: '100%', height: '100%' }}
                            />
                        ) : null}
                    </View>
                </View>

                <Text className="text-fg-1 text-base font-semibold mb-3">
                    {t('settings.profileSettings')}
                </Text>
                <Input
                    label={t('settings.nickname')}
                    placeholder={t('settings.nicknamePlaceholder')}
                    value={nickname}
                    onChangeText={setNickname}
                />
                <Button onPress={saveProfile} loading={updateProfile.isPending}>
                    {t('common.save')}
                </Button>

                <View className="h-6" />
                <PinChangeSection />

                <EmailChangeSection />

                <Text className="text-fg-1 text-base font-semibold mb-3">
                    {t('settings.changePassword')}
                </Text>
                <Input
                    label={t('settings.currentPassword')}
                    placeholder={t('settings.currentPasswordPlaceholder')}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                />
                <Input
                    label={t('settings.newPassword')}
                    placeholder={t('settings.newPasswordPlaceholder')}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />
                <Input
                    label={t('settings.confirmNewPassword')}
                    placeholder={t('settings.confirmNewPasswordPlaceholder')}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                {error ? (
                    <Text className="text-destructive text-xs mb-2">{error}</Text>
                ) : null}
                <Button onPress={submitPassword} loading={changePassword.isPending}>
                    {t('settings.changePassword')}
                </Button>

                <View className="h-6" />
                <Text className="text-fg-1 text-base font-semibold mb-3">
                    {t('header.selectLanguage')}
                </Text>
                <View className="flex-row gap-2">
                    {langs.map((l) => (
                        <Pressable
                            key={l.code}
                            onPress={() => i18n.changeLanguage(l.code)}
                            className={`flex-1 h-11 rounded-xl items-center justify-center border ${
                                i18n.language === l.code
                                    ? 'bg-primary border-primary'
                                    : 'border-border-2 bg-bg-el2'
                            }`}
                        >
                            <Text
                                className={
                                    i18n.language === l.code
                                        ? 'text-white font-semibold'
                                        : 'text-fg-2'
                                }
                            >
                                {l.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <View className="h-8" />
                <Button variant="secondary" onPress={onLogout}>
                    {t('header.logout')}
                </Button>

                <View className="h-6" />
                <Text className="text-destructive text-base font-semibold mb-2">
                    {t('settings.dangerZone')}
                </Text>
                <Text className="text-fg-3 text-xs mb-3">
                    {t('settings.deleteAccountDesc')}
                </Text>
                <Button
                    variant="destructive"
                    onPress={() => setShowDelete(true)}
                >
                    {t('settings.deleteAccount')}
                </Button>
            </ScrollView>

            <DeleteAccountModal
                visible={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={onDelete}
                pending={deleteAccount.isPending}
            />
        </Screen>
    )
}
