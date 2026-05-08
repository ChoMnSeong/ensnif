import { useEffect, useState } from 'react'
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { PinInput } from '@components/auth/PinInput'
import {
    useCreateProfileMutation,
    useUpdateProfileMutation,
} from '@libs/apis/auth'
import { useImageMutation } from '@libs/apis/images'

interface Props {
    visible: boolean
    mode: 'create' | 'edit'
    initial?: {
        nickname?: string
        avatarUrl?: string
        age?: number | null
    }
    onClose: () => void
    onDone: () => void
}

export const ProfileEditModal = ({
    visible,
    mode,
    initial,
    onClose,
    onDone,
}: Props) => {
    const { t } = useTranslation()
    const [nickname, setNickname] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [age, setAge] = useState('')
    const [usePin, setUsePin] = useState(false)
    const [pin, setPin] = useState('')
    const [error, setError] = useState<string | null>(null)

    const create = useCreateProfileMutation()
    const update = useUpdateProfileMutation()
    const upload = useImageMutation()

    useEffect(() => {
        if (!visible) return
        setNickname(initial?.nickname ?? '')
        setAvatarUrl(initial?.avatarUrl ?? '')
        setAge(initial?.age != null ? String(initial.age) : '')
        setUsePin(false)
        setPin('')
        setError(null)
    }, [visible, initial])

    const pickImage = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        })
        if (res.canceled || !res.assets?.[0]) return
        const asset = res.assets[0]
        try {
            const uploaded = await upload.mutateAsync({
                uri: asset.uri,
                name: asset.fileName ?? 'upload.jpg',
                type: asset.mimeType ?? 'image/jpeg',
            })
            const url = (uploaded as any)?.data ?? uploaded
            if (typeof url === 'string') setAvatarUrl(url)
        } catch {
            Toast.show({ type: 'error', text1: t('image.uploadFailed') })
        }
    }

    const submit = async () => {
        setError(null)
        if (!nickname.trim()) {
            setError(t('auth.nicknameFormatError'))
            return
        }
        if (usePin && pin.length !== 4) {
            setError(t('auth.pinRequired'))
            return
        }
        try {
            if (mode === 'create') {
                await create.mutateAsync({
                    nickname,
                    avatarUrl,
                    pin: usePin ? pin : undefined,
                })
            } else {
                await update.mutateAsync({
                    name: nickname,
                    avatarUrl,
                    age: age ? Number(age) : undefined,
                    pin: usePin ? pin : undefined,
                })
            }
            Toast.show({ type: 'success', text1: t('settings.saveSuccess') })
            onDone()
            onClose()
        } catch {
            Toast.show({ type: 'error', text1: t('settings.saveFailed') })
        }
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-bg-page">
                <View className="flex-row items-center justify-between px-4 h-14 border-b border-border-1">
                    <Pressable onPress={onClose} hitSlop={8}>
                        <Ionicons name="close" size={24} color="#FAFAF8" />
                    </Pressable>
                    <Text className="text-fg-1 font-semibold">
                        {mode === 'create'
                            ? t('auth.newProfile')
                            : t('settings.profileSettings')}
                    </Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    <View className="items-center mb-5">
                        <Pressable onPress={pickImage} className="relative">
                            <View className="w-24 h-24 rounded-full overflow-hidden bg-bg-el2 items-center justify-center">
                                {avatarUrl ? (
                                    <Image
                                        source={{ uri: avatarUrl }}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                ) : (
                                    <Ionicons
                                        name="person"
                                        size={36}
                                        color="#848484"
                                    />
                                )}
                            </View>
                            <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary items-center justify-center">
                                <Ionicons name="camera" size={16} color="#fff" />
                            </View>
                        </Pressable>
                        {upload.isPending ? (
                            <Text className="text-fg-3 text-xs mt-2">
                                {t('image.uploading')}
                            </Text>
                        ) : null}
                    </View>

                    <Input
                        label={t('auth.nickname')}
                        placeholder={t('auth.profileNamePlaceholder')}
                        value={nickname}
                        onChangeText={setNickname}
                        maxLength={10}
                    />

                    {mode === 'edit' ? (
                        <Input
                            label={t('auth.profileAgePlaceholder')}
                            placeholder="0"
                            keyboardType="number-pad"
                            value={age}
                            onChangeText={setAge}
                            maxLength={3}
                        />
                    ) : null}

                    <Pressable
                        className="flex-row items-center justify-between py-2"
                        onPress={() => setUsePin((v) => !v)}
                    >
                        <Text className="text-fg-1 text-sm">
                            {t('auth.useLock')}
                        </Text>
                        <Ionicons
                            name={usePin ? 'toggle' : 'toggle-outline'}
                            size={32}
                            color={usePin ? '#b473f9' : '#848484'}
                        />
                    </Pressable>

                    {usePin ? (
                        <View className="mt-3">
                            <Text className="text-fg-3 text-xs mb-3 text-center">
                                {t('auth.setPinHint')}
                            </Text>
                            <PinInput value={pin} onChange={setPin} />
                        </View>
                    ) : null}

                    {error ? (
                        <Text className="text-destructive text-xs mt-3 text-center">
                            {error}
                        </Text>
                    ) : null}
                </ScrollView>

                <View className="px-4 py-3 border-t border-border-1">
                    <Button
                        onPress={submit}
                        loading={create.isPending || update.isPending}
                    >
                        {t('common.save')}
                    </Button>
                </View>
            </View>
        </Modal>
    )
}
