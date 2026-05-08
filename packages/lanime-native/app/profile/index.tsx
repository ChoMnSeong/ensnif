import { useEffect, useState } from 'react'
import {
    View,
    Text,
    Pressable,
    ScrollView,
} from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { Screen } from '@components/common/Screen'
import { Empty } from '@components/common/Empty'
import {
    useProfilesQuery,
    useCheckProfileAccessMutation,
    useVerifyProfilePinMutation,
} from '@libs/apis/auth'
import tokenStorage from '@libs/tokenStorage'
import { useAppDispatch } from '@libs/hooks/useAppDispatch'
import { setUserProfile } from '@stores/auth'
import { Button } from '@components/common/Button'
import { PinInput } from '@components/auth/PinInput'
import { ProfileEditModal } from '@components/auth/ProfileEditModal'
import { useQueryClient } from '@tanstack/react-query'

export default function ProfilePage() {
    const { t } = useTranslation()
    const router = useRouter()
    const dispatch = useAppDispatch()

    const { data: profiles, isLoading } = useProfilesQuery()
    const checkAccess = useCheckProfileAccessMutation()
    const verifyPin = useVerifyProfilePinMutation()

    const [pinProfile, setPinProfile] = useState<{
        profileId: string
        name: string
        avatarUrl: string
    } | null>(null)
    const [pin, setPin] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const queryClient = useQueryClient()

    const enterProfile = async (p: { profileId: string; name: string; avatarUrl: string }) => {
        setError(null)
        try {
            const res = await checkAccess.mutateAsync(p.profileId)
            if (res?.isPasswordRequired) {
                setPinProfile(p)
                return
            }
            if (res?.profileToken) {
                await tokenStorage.set.profileToken(res.profileToken)
                dispatch(
                    setUserProfile({
                        nickname: p.name,
                        avatarUrl: p.avatarUrl,
                        profileId: p.profileId,
                        age: null,
                    }),
                )
                router.replace('/')
            }
        } catch {
            setError(t('auth.serverError'))
        }
    }

    const submitPin = async () => {
        if (!pinProfile) return
        if (pin.length !== 4) {
            setError(t('auth.pinRequired'))
            return
        }
        try {
            const res = await verifyPin.mutateAsync({
                profileId: pinProfile.profileId,
                request: { pin },
            })
            if (res?.profileToken) {
                await tokenStorage.set.profileToken(res.profileToken)
                dispatch(
                    setUserProfile({
                        nickname: pinProfile.name,
                        avatarUrl: pinProfile.avatarUrl,
                        profileId: pinProfile.profileId,
                        age: null,
                    }),
                )
                router.replace('/')
            }
        } catch {
            setError(t('auth.codeMismatch'))
        }
    }

    if (pinProfile) {
        return (
            <Screen>
                <View className="flex-1 px-6 pt-12 items-center">
                    <View className="w-24 h-24 rounded-full overflow-hidden bg-bg-el2 mb-4">
                        <Image
                            source={{ uri: pinProfile.avatarUrl }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </View>
                    <Text className="text-fg-1 text-lg font-semibold mb-2">
                        {pinProfile.name}
                    </Text>
                    <Text className="text-fg-3 text-sm mb-6">
                        {t('auth.enterPin')}
                    </Text>
                    <View className="w-full">
                        <View className="mb-4">
                            <PinInput
                                value={pin}
                                onChange={setPin}
                                onComplete={() => submitPin()}
                            />
                        </View>
                        {error ? (
                            <Text className="text-destructive text-xs mb-2 text-center">
                                {error}
                            </Text>
                        ) : null}
                        <Button onPress={submitPin} loading={verifyPin.isPending}>
                            {t('auth.next')}
                        </Button>
                        <Pressable
                            className="mt-4 self-center"
                            onPress={() =>
                                router.push({
                                    pathname: '/profile/reset-pin',
                                    params: {
                                        profileId: pinProfile.profileId,
                                        profileName: pinProfile.name,
                                    },
                                })
                            }
                        >
                            <Text className="text-primary text-sm">
                                {t('auth.forgotPin')}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Screen>
        )
    }

    return (
        <Screen>
            <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
                <Pressable onPress={() => router.push('/settings')} hitSlop={12}>
                    <Ionicons name="settings-outline" size={22} color="#FAFAF8" />
                </Pressable>
            </View>

            <View className="px-6 pt-8 pb-10">
                <Text className="text-fg-1 text-2xl font-bold text-center">
                    {t('auth.selectProfile')}
                </Text>
            </View>

            {isLoading ? (
                <Empty message={t('auth.loadingProfile')} />
            ) : (
                <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
                    <View
                        className="flex-row flex-wrap justify-center"
                        style={{ rowGap: 24, columnGap: 24 }}
                    >
                        {(profiles ?? []).map((item) => (
                            <Pressable
                                key={item.profileId}
                                className="items-center"
                                style={{ width: 96 }}
                                onPress={() => enterProfile(item)}
                            >
                                <View className="w-24 h-24 rounded-full overflow-hidden bg-bg-el2 border border-border-1">
                                    <Image
                                        source={{ uri: item.avatarUrl }}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </View>
                                <Text
                                    className="text-fg-1 mt-2 text-sm"
                                    numberOfLines={1}
                                >
                                    {item.name}
                                </Text>
                                {item.isOwner ? (
                                    <Text className="text-primary text-[10px] mt-0.5">
                                        {t('auth.ownerBadge')}
                                    </Text>
                                ) : null}
                            </Pressable>
                        ))}

                        <Pressable
                            className="items-center"
                            style={{ width: 96 }}
                            onPress={() => setShowAddModal(true)}
                        >
                            <View className="w-24 h-24 rounded-full bg-bg-el2 border border-dashed border-border-2 items-center justify-center">
                                <Ionicons
                                    name="add"
                                    size={32}
                                    color="#848484"
                                />
                            </View>
                            <Text className="text-fg-3 mt-2 text-sm">
                                {t('auth.addProfile')}
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            )}

            <ProfileEditModal
                visible={showAddModal}
                mode="create"
                onClose={() => setShowAddModal(false)}
                onDone={() =>
                    queryClient.invalidateQueries({ queryKey: ['profiles'] })
                }
            />
        </Screen>
    )
}
