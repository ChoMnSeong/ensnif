import React from 'react'
import styled from '@emotion/styled'
import { IUserProfile } from '../../libs/apis/auth/type'
import { themedPalette } from '../../libs/style/theme'
import Flex from '../common/Flex'
import Text from '../common/Text'
import Image from '../common/Image'
import lock from '../../assets/lock.svg'

interface ProfileListProps {
    profiles: IUserProfile[]
    onProfileSelect: (profile: IUserProfile) => void
    onAddProfile: () => void
}

const ProfileList: React.FC<ProfileListProps> = ({
    profiles,
    onProfileSelect,
    onAddProfile,
}) => {
    return (
        <Flex gap="2.5rem">
            {profiles.map((profile) => (
                <UserProfileCard
                    key={profile.profileId}
                    onClick={() => onProfileSelect(profile)}
                >
                    <AvatarWrapper>
                        {profile.admin && <Badge>대표</Badge>}
                        <Image
                            src={profile.avatarUrl || ''}
                            alt={profile.name}
                            width="140px"
                            height="140px"
                            borderRadius="50%"
                            border={`2px solid ${themedPalette.border2}`}
                        />
                        {profile.pin && (
                            <LockIcon>
                                <Image src={lock} alt={'lock'} />
                            </LockIcon>
                        )}
                    </AvatarWrapper>
                    <Text sz="lgCt" color={themedPalette.text2}>
                        {profile.name}
                    </Text>
                </UserProfileCard>
            ))}

            {profiles.length < 4 && (
                <UserProfileCard onClick={onAddProfile}>
                    <AvatarWrapper>
                        <AddAvatar>
                            <Text sz="lgTl" color={themedPalette.text1}>
                                +
                            </Text>
                        </AddAvatar>
                    </AvatarWrapper>
                    <Text sz="lgCt" color={themedPalette.text2}>
                        추가
                    </Text>
                </UserProfileCard>
            )}
        </Flex>
    )
}

export default ProfileList

const UserProfileCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s ease;
    &:hover {
        transform: scale(1.05);
    }
`
const AvatarWrapper = styled.div`
    position: relative;
    margin-bottom: 12px;
`
const AddAvatar = styled(Flex)`
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background-color: ${themedPalette.bg_element3};
    border: 2px solid ${themedPalette.border2};
    align-items: center;
    justify-content: center;
`
const Badge = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${themedPalette.primary1};
    color: ${themedPalette.white};
    font-size: 12px;
    font-weight: bold;
    padding: 4px 12px;
    border-radius: 12px;
`
const LockIcon = styled.div`
    position: absolute;
    bottom: 4px;
    right: 12px;
    background-color: ${themedPalette.bg_element6};
    border: 1px solid ${themedPalette.border2};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
`
