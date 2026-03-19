// src/components/auth/ProfilePresenter.tsx
import React from 'react'
import ProfileList from './ProfileList'
import PinInputModal from './PinInputModal'
import AddProfileModal from './AddProfileModal'
import Text from '../common/Text'
import Flex from '../common/Flex'
import { themedPalette } from '../../libs/style/theme'
import { IUserProfile, IProfileCreateRequest } from '../../libs/apis/auth/type'

interface ProfilePresenterProps {
    profiles: IUserProfile[]
    isLoading: boolean
    isPinModalOpen: boolean
    isAddProfileModalOpen: boolean
    onProfileSelect: (profile: IUserProfile) => void
    onPinVerify: (pin: string) => void
    onCreateProfile: (request: IProfileCreateRequest) => void
    onClosePinModal: () => void
    onCloseAddModal: () => void
    onOpenAddModal: () => void
}

const ProfilePresenter: React.FC<ProfilePresenterProps> = ({
    profiles,
    isLoading,
    isPinModalOpen,
    isAddProfileModalOpen,
    onProfileSelect,
    onPinVerify,
    onCreateProfile,
    onClosePinModal,
    onCloseAddModal,
    onOpenAddModal,
}) => {
    if (isLoading) {
        return (
            <Flex height="100%" alignItems="center" justifyContent="center">
                <Text color={themedPalette.text1} sz="mdCt">
                    로딩 중...
                </Text>
            </Flex>
        )
    }

    return (
        <Flex
            gap="3rem"
            direction="column"
            alignItems="center"
            padding="4rem 0"
        >
            <Text sz="lgTl" color={themedPalette.text1}>
                사용할 프로필을 선택해주세요.
            </Text>

            <ProfileList
                profiles={profiles}
                onProfileSelect={onProfileSelect}
                onAddProfile={onOpenAddModal}
            />

            {isPinModalOpen && (
                <PinInputModal
                    onClose={onClosePinModal}
                    onComplete={onPinVerify}
                />
            )}

            {isAddProfileModalOpen && (
                <AddProfileModal
                    onClose={onCloseAddModal}
                    onComplete={onCreateProfile}
                />
            )}
        </Flex>
    )
}

export default ProfilePresenter
