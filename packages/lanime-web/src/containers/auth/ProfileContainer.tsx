import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    useProfilesQuery,
    useCheckProfileAccessMutation,
    useVerifyProfilePinMutation,
} from '../../libs/apis/auth'
import customCookie from '../../libs/customCookie'
import ProfileList from '../../components/auth/ProfileList'
import PinInputModal from '../../components/auth/PinInputModal'
import Text from '../../components/common/Text'
import Flex from '../../components/common/Flex'
import { themedPalette } from '../../libs/style/theme'
import { IProfilePinRequest } from '../../libs/apis/auth/type'

const ProfileContainer = () => {
    const navigate = useNavigate()
    const { data: profiles = [], isLoading } = useProfilesQuery()
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
        null,
    )
    const [isPinModalOpen, setIsPinModalOpen] = useState(false)

    const { mutate: checkAccess } = useCheckProfileAccessMutation(
        selectedProfileId || '',
    )
    const { mutate: verifyPin } = useVerifyProfilePinMutation(
        selectedProfileId || '',
    )

    const handleProfileSelect = useCallback(
        (profileId: string) => {
            setSelectedProfileId(profileId)
            checkAccess(undefined, {
                onSuccess: (res) => {
                    if (res?.passwordRequired) setIsPinModalOpen(true)
                    else if (res?.profileToken) {
                        customCookie.set.profileToken(res.profileToken)
                        navigate('/')
                    }
                },
                onError: () => alert('프로필 접근 중 오류가 발생했습니다.'),
            })
        },
        [checkAccess, navigate],
    )

    // 2. PIN 검증 핸들러 메모이제이션 (이 부분이 핵심!)
    const handlePinVerify = useCallback(
        (pin: string) => {
            verifyPin({ pin } as IProfilePinRequest, {
                onSuccess: (res) => {
                    if (res?.profileToken) {
                        customCookie.set.profileToken(res.profileToken)
                        navigate('/')
                    } else {
                        alert('비밀번호가 틀렸습니다.')
                    }
                },
                onError: () => alert('인증 중 오류가 발생했습니다.'),
            })
        },
        [verifyPin, navigate],
    )

    if (isLoading)
        return (
            <Flex height="100%" alignItems="center" justifyContent="center">
                <Text color={themedPalette.text1} sz="mdCt">
                    로딩 중...
                </Text>
            </Flex>
        )

    return (
        <Flex gap="3rem" direction="column" alignItems="center">
            <Text sz="lgTl" color={themedPalette.text1}>
                사용할 프로필을 선택해주세요.
            </Text>

            <ProfileList
                profiles={profiles}
                onProfileSelect={handleProfileSelect}
                onAddProfile={() => console.log('추가')}
            />

            {isPinModalOpen && (
                <PinInputModal
                    onClose={() => setIsPinModalOpen(false)}
                    onComplete={handlePinVerify}
                />
            )}
        </Flex>
    )
}

export default ProfileContainer
