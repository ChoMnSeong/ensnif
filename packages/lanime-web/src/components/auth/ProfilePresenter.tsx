import React from 'react'
import ProfileList from '@components/auth/ProfileList'
import PinInputModal from '@components/auth/PinInputModal'
import AddProfileModal from '@components/auth/AddProfileModal'
import Text from '@components/common/Text'
import Flex from '@components/common/Flex'
import { themedPalette } from '@libs/style/theme'
import { IUserProfile, IProfileCreateRequest } from '@libs/apis/auth/type'

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
            <Flex height="100%" align="center" justify="center">
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
            align="center"
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
