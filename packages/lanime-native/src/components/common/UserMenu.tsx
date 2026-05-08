import { useState } from 'react'
import {
    Modal,
    Pressable,
    Text,
    View,
} from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@libs/hooks/useAppDispatch'
import tokenStorage from '@libs/tokenStorage'
import i18n from '@libs/i18n'

const LANGS = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
]

export const UserMenu = () => {
    const { t } = useTranslation()
    const router = useRouter()
    const profile = useAppSelector((s) => s.userProfile)
    const [open, setOpen] = useState(false)
    const isLoggedIn = !!profile.profileId

    const onLogout = async () => {
        setOpen(false)
        await Promise.all([
            tokenStorage.remove.accessToken(),
            tokenStorage.remove.refreshToken(),
            tokenStorage.remove.profileToken(),
        ])
        router.replace('/auth/mail')
    }

    return (
        <>
            <Pressable onPress={() => setOpen(true)} hitSlop={10}>
                {isLoggedIn && profile.avatarUrl ? (
                    <View className="w-9 h-9 rounded-full overflow-hidden bg-bg-el2">
                        <Image
                            source={{ uri: profile.avatarUrl }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </View>
                ) : (
                    <View className="w-9 h-9 rounded-full bg-bg-el2 items-center justify-center">
                        <Ionicons name="person" size={18} color="#FAFAF8" />
                    </View>
                )}
            </Pressable>

            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable
                    onPress={() => setOpen(false)}
                    className="flex-1 bg-black/40 items-end pt-16 pr-3"
                >
                    <Pressable
                        className="bg-bg-el1 rounded-2xl border border-border-1 w-64 p-2"
                        onPress={() => {}}
                    >
                        {isLoggedIn ? (
                            <>
                                <View className="px-3 py-2 border-b border-border-1">
                                    <Text className="text-fg-1 font-semibold">
                                        {profile.nickname ?? ''}
                                    </Text>
                                </View>
                                <Pressable
                                    className="px-3 py-3"
                                    onPress={() => {
                                        setOpen(false)
                                        router.push('/profile')
                                    }}
                                >
                                    <Text className="text-fg-2">
                                        {t('header.profileChange')}
                                    </Text>
                                </Pressable>
                                <Pressable
                                    className="px-3 py-3"
                                    onPress={() => {
                                        setOpen(false)
                                        router.push('/settings')
                                    }}
                                >
                                    <Text className="text-fg-2">
                                        {t('header.settings')}
                                    </Text>
                                </Pressable>
                                <View className="h-px bg-border-1 my-1" />
                            </>
                        ) : (
                            <Pressable
                                className="px-3 py-3"
                                onPress={() => {
                                    setOpen(false)
                                    router.push('/auth/mail')
                                }}
                            >
                                <Text className="text-primary font-semibold">
                                    {t('header.login')}
                                </Text>
                            </Pressable>
                        )}

                        <Text className="px-3 py-2 text-fg-4 text-xs">
                            {t('header.selectLanguage')}
                        </Text>
                        <View className="flex-row px-2 pb-2" style={{ gap: 6 }}>
                            {LANGS.map((l) => (
                                <Pressable
                                    key={l.code}
                                    onPress={() => i18n.changeLanguage(l.code)}
                                    className={`flex-1 h-9 rounded-lg items-center justify-center border ${
                                        i18n.language === l.code
                                            ? 'bg-primary border-primary'
                                            : 'border-border-2 bg-bg-el2'
                                    }`}
                                >
                                    <Text
                                        className={
                                            i18n.language === l.code
                                                ? 'text-white text-xs font-semibold'
                                                : 'text-fg-2 text-xs'
                                        }
                                    >
                                        {l.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {isLoggedIn ? (
                            <Pressable className="px-3 py-3" onPress={onLogout}>
                                <Text className="text-destructive">
                                    {t('header.logout')}
                                </Text>
                            </Pressable>
                        ) : null}
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    )
}
