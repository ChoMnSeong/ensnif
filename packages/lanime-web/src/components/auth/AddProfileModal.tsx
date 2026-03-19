import React, { useState, useRef } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '../../libs/style/theme'
import Flex from '../common/Flex'
import Text from '../common/Text'
import Input from '../common/Input'
import Switch from '../common/Switch'
import ProfileModalLayout from './ProfileModalLayout'
import PinInput from '../common/PinInput'
import { useImageMutation } from '../../libs/apis/images'
import { ProfileModalProps } from '../../containers/auth/ProfileContainer'
import { IProfileCreateRequest } from '../../libs/apis/auth/type'
import { toast } from 'sonner'

const DEFAULT_AVATAR =
    'http://localhost:8080/aedd1086-948a-4f8b-b0c6-243b88cadab7.jpg'

const AddProfileModal: React.FC<ProfileModalProps<IProfileCreateRequest>> = ({
    onClose,
    onComplete,
}) => {
    const [nickname, setNickname] = useState('')
    const [isPinEnabled, setIsPinEnabled] = useState(false)
    const [pin, setPin] = useState(['', '', '', ''])
    const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const { mutate: uploadImage, isPending: isUploading } = useImageMutation()

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        uploadImage(file, {
            onSuccess: (res) => {
                if (res.success && res.data) {
                    setAvatarUrl(res.data)
                }
            },
            onError: () => {
                toast.error('이미지 업로드에 실패했습니다.')
            },
        })
    }

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
            <Flex gap="3rem" direction="column" alignItems="center">
                <Text sz="lgTl" color={themedPalette.text1}>
                    새 프로필
                </Text>

                {/* 이미지 업로드 트리거 */}
                <ProfileImageWrapper onClick={handleImageClick}>
                    <img
                        src={avatarUrl}
                        alt="profile"
                        style={{ opacity: isUploading ? 0.5 : 1 }}
                    />
                    <EditOverlay>
                        {isUploading ? '업로드 중...' : '수정'}
                    </EditOverlay>
                </ProfileImageWrapper>

                {/* 숨겨진 파일 인풋 */}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
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
                            alignItems="center"
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
                    <ActionButton onClick={onClose}>취소</ActionButton>
                    <ActionButton
                        primary
                        onClick={handleSave}
                        disabled={isUploading}
                    >
                        저장
                    </ActionButton>
                </Flex>
            </Flex>
        </ProfileModalLayout>
    )
}

export default AddProfileModal

// ... 기존 Styled Components (ProfileImageWrapper, EditOverlay, ActionButton)

const ProfileImageWrapper = styled.div`
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid ${themedPalette.border2};
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const EditOverlay = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    color: ${themedPalette.white};
    text-align: center;
    padding: 6px 0;
    font-size: 0.8rem;
    cursor: pointer;
`

const ActionButton = styled.button<{ primary?: boolean }>`
    background: ${(props) =>
        props.primary ? themedPalette.primary1 : 'transparent'};
    border: 1px solid
        ${(props) =>
            props.primary ? themedPalette.primary1 : themedPalette.border2};
    color: ${(props) =>
        props.primary ? themedPalette.white : themedPalette.text2};
    padding: 10px 32px;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
        background: ${(props) =>
            props.primary ? themedPalette.primary2 : themedPalette.bg_element3};
    }
`
