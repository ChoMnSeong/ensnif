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

const AddProfileModal: React.FC<ProfileModalProps<IProfileCreateRequest>> = ({
    onClose,
    onComplete,
}) => {
    const [nickname, setNickname] = useState('')
    const [isPinEnabled, setIsPinEnabled] = useState(false)
    const [pin, setPin] = useState(['', '', '', ''])
    const [avatarUrl, setAvatarUrl] = useState(defaultAvatar)

    const handleSave = () => {
        const fullPin = pin.join('')
        if (isPinEnabled && fullPin.length < 4) {
            toast.error('PIN 번호 4자리를 모두 입력해주세요.')
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
                    새 프로필
                </Text>

                <ProfileImageUpload
                    avatarUrl={avatarUrl}
                    onChange={setAvatarUrl}
                    size={120}
                />

                <Input
                    placeholder="프로필 이름"
                    value={nickname}
                    count={nickname.length}
                    maxCount={15}
                    onChange={(e) => setNickname(e.target.value.slice(0, 15))}
                    width="300px"
                />

                <Flex direction="column" gap="1rem">
                    <Switch
                        label="계정 잠금 사용"
                        checked={isPinEnabled}
                        onChange={setIsPinEnabled}
                        width="300px"
                    />

                    {isPinEnabled && (
                        <Flex
                            direction="column"
                            align="center"
                            margin="1.5rem 0 0 0"
                        >
                            <Text
                                sz="smCt"
                                color={themedPalette.text3}
                                margin="0 0 1rem 0"
                            >
                                4자리 PIN 번호를 설정하세요
                            </Text>
                            <PinInput value={pin} onChange={setPin} size="sm" />
                        </Flex>
                    )}
                </Flex>

                <Flex gap="1rem">
                    <Button variant="secondary" onClick={onClose} type="button">
                        취소
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        type="button"
                    >
                        저장
                    </Button>
                </Flex>
            </Flex>
        </ProfileModalLayout>
    )
}

export default AddProfileModal
