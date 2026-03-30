import React, { useState } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import { IUserProfile } from '@libs/apis/auth/type'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Button from '@components/common/Button'
import Image from '@components/common/Image'
import DeleteConfirmModal from '@components/common/DeleteConfirmModal'

interface SettingsDangerSectionProps {
    profiles: IUserProfile[]
    onDelete: (profileId: string) => void
    isDeleting: boolean
}

const SettingsDangerSection: React.FC<SettingsDangerSectionProps> = ({
    profiles,
    onDelete,
    isDeleting,
}) => {
    const [modalProfile, setModalProfile] = useState<IUserProfile | null>(null)

    const deletableProfiles = profiles.filter((p) => !p.admin)

    return (
        <Flex direction="column" gap="1.25rem">
            <SectionTitle>프로필 삭제</SectionTitle>
            {deletableProfiles.length === 0 ? (
                <Text sz="smCt" color={themedPalette.text3}>
                    삭제할 수 있는 프로필이 없습니다.
                </Text>
            ) : (
                <ProfileList direction="column">
                    {deletableProfiles.map((profile) => (
                        <ProfileRow key={profile.profileId} align="center" justify="space-between" padding="0.875rem 1.25rem">
                            <Flex align="center" gap="0.75rem">
                                <Image
                                    src={profile.avatarUrl}
                                    alt={profile.name}
                                    width={40}
                                    height={40}
                                    borderRadius="50%"
                                    border={`1px solid ${themedPalette.border2}`}
                                />
                                <Text sz="smCt" color={themedPalette.text1}>
                                    {profile.name}
                                </Text>
                            </Flex>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setModalProfile(profile)}
                            >
                                삭제
                            </Button>
                        </ProfileRow>
                    ))}
                </ProfileList>
            )}

            {modalProfile && (
                <DeleteConfirmModal
                    title={`"${modalProfile.name}" 프로필 삭제`}
                    description="이 프로필의 모든 데이터가 영구적으로 삭제됩니다. 정말 삭제하시겠습니까?"
                    confirmPhrase={modalProfile.name}
                    confirmLabel="프로필 삭제"
                    isLoading={isDeleting}
                    onConfirm={() => {
                        onDelete(modalProfile.profileId)
                        setModalProfile(null)
                    }}
                    onClose={() => setModalProfile(null)}
                />
            )}
        </Flex>
    )
}

export default SettingsDangerSection

const SectionTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: ${themedPalette.text1};
    margin: 0;
`

const ProfileList = styled(Flex)`
    border: 1px solid ${themedPalette.border2};
    border-radius: 10px;
    overflow: hidden;
`

const ProfileRow = styled(Flex)`
    background-color: ${themedPalette.bg_element1};

    &:not(:last-of-type) {
        border-bottom: 1px solid ${themedPalette.border2};
    }
`
