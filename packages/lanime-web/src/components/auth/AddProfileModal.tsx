import React, { useState } from 'react'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Input from '@components/common/Input'
import Switch from '@components/common/Switch'
import Button from '@components/common/Button'
import ProfileModalLayout from '@components/auth/ProfileModalLayout'
import PinInput from '@components/common/PinInput'
import ProfileImageUpload from '@components/common/ProfileImageUpload'
import { ProfileModalProps } from '@containers/auth/ProfileContainer'
import { IProfileCreateRequest } from '@libs/apis/auth/type'
import { toast } from 'sonner'
import { defaultAvatar } from '@/libs/constants/image'
import { useTranslation } from 'react-i18next'

const AddProfileModal: React.FC<ProfileModalProps<IProfileCreateRequest>> = ({
    onClose,
    onComplete,
}) => {
    const { t } = useTranslation()
    const [nickname, setNickname] = useState('')
    const [isPinEnabled, setIsPinEnabled] = useState(false)
    const [pin, setPin] = useState(['', '', '', ''])
    const [avatarUrl, setAvatarUrl] = useState(defaultAvatar)

    const handleSave = () => {
        const fullPin = pin.join('')
        if (isPinEnabled && fullPin.length < 4) {
            toast.error(t('auth.pinRequired'))
            return
        }

        const request = {
            nickname,
            avatarUrl,
            pin: isPinEnabled ? fullPin : null,
        } as IProfileCreateRequest

        onComplete(request)
        onClose()
    }

    return (
        <ProfileModalLayout onClose={onClose}>
            <Flex gap="3rem" direction="column" align="center">
                <Text sz="lgTl" color={themedPalette.text1}>
                    {t('auth.newProfile')}
                </Text>

                <ProfileImageUpload
                    avatarUrl={avatarUrl}
                    onChange={setAvatarUrl}
                    size={120}
                />

                <Input
                    placeholder={t('auth.profileNamePlaceholder')}
                    value={nickname}
                    count={nickname.length}
                    maxCount={15}
                    onChange={(e) => setNickname(e.target.value.slice(0, 15))}
                    width="300px"
                />

                <Flex direction="column" gap="1rem">
                    <Switch
                        label={t('auth.useLock')}
                        checked={isPinEnabled}
                        onChange={setIsPinEnabled}
                        width="300px"
                    />

                    {isPinEnabled && (
                        <Flex direction="column" align="center" margin="1.5rem 0 0 0">
                            <Text sz="smCt" color={themedPalette.text3} margin="0 0 1rem 0">
                                {t('auth.setPinHint')}
                            </Text>
                            <PinInput value={pin} onChange={setPin} size="sm" />
                        </Flex>
                    )}
                </Flex>

                <Flex gap="1rem">
                    <Button variant="secondary" onClick={onClose} type="button">
                        {t('common.cancel')}
                    </Button>
                    <Button variant="primary" onClick={handleSave} type="button">
                        {t('common.save')}
                    </Button>
                </Flex>
            </Flex>
        </ProfileModalLayout>
    )
}

export default AddProfileModal
