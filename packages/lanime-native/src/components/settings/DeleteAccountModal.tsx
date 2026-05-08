import { useState } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'

interface Props {
    visible: boolean
    onClose: () => void
    onConfirm: () => void
    pending?: boolean
}

export const DeleteAccountModal = ({
    visible,
    onClose,
    onConfirm,
    pending,
}: Props) => {
    const { t } = useTranslation()
    const [phrase, setPhrase] = useState('')
    const required = t('settings.deleteAccountConfirmPhrase')
    const matches = phrase.trim() === required

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 items-center justify-center bg-black/70 px-6">
                <View className="w-full bg-bg-el1 rounded-2xl p-5">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-destructive text-lg font-bold">
                            {t('settings.deleteAccount')}
                        </Text>
                        <Pressable onPress={onClose} hitSlop={8}>
                            <Ionicons name="close" size={20} color="#FAFAF8" />
                        </Pressable>
                    </View>
                    <Text className="text-fg-2 text-sm mb-4">
                        {t('settings.deleteAccountModalDesc')}
                    </Text>
                    <Text className="text-fg-3 text-xs mb-2">
                        {required}
                    </Text>
                    <Input
                        value={phrase}
                        onChangeText={setPhrase}
                        placeholder={required}
                        autoCapitalize="none"
                    />
                    <View className="flex-row" style={{ gap: 8 }}>
                        <View className="flex-1">
                            <Button variant="secondary" onPress={onClose}>
                                {t('common.cancel')}
                            </Button>
                        </View>
                        <View className="flex-1">
                            <Button
                                variant="destructive"
                                onPress={onConfirm}
                                loading={pending}
                                disabled={!matches}
                            >
                                {t('common.delete')}
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
