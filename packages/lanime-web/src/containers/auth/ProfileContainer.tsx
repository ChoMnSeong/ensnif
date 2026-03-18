import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
    useProfilesQuery,
    useCheckProfileAccessMutation,
    useVerifyProfilePinMutation,
} from '../../libs/apis/auth'
import { setUserProfile } from '../../stores/auth/reducer'
import customCookie from '../../libs/customCookie'

import ProfileList from '../../components/auth/ProfileList'
import PinInputModal from '../../components/auth/PinInputModal'
import Text from '../../components/common/Text'
import Flex from '../../components/common/Flex'

import { themedPalette } from '../../libs/style/theme'
import { IUserProfile } from '../../libs/apis/auth/type'

const ProfileContainer = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { data: profiles = [], isLoading } = useProfilesQuery()
    const [selectedProfile, setSelectedProfile] = useState<IUserProfile | null>(
        null,
    )
    const [isPinModalOpen, setIsPinModalOpen] = useState(false)
    const { mutate: checkAccess } = useCheckProfileAccessMutation()
    const { mutate: verifyPin } = useVerifyProfilePinMutation()

    const handleLoginSuccess = useCallback(
        (profile: IUserProfile, token: string) => {
            // 프로필 전용 토큰 저장
            customCookie.set.profileToken(token)

            dispatch(
                setUserProfile({
                    nickname: profile.name,
                    avatarUrl: profile.avatarUrl,
                    profileId: profile.profileId,
                }),
            )

            // 메인으로 이동
            navigate('/')
        },
        [dispatch, navigate],
    )

    const handleProfileSelect = useCallback(
        (profile: IUserProfile) => {
            setSelectedProfile(profile)

            checkAccess(profile.profileId, {
                onSuccess: (res) => {
                    if (res?.passwordRequired) {
                        // PIN이 필요한 경우 모달 오픈
                        setIsPinModalOpen(true)
                    } else if (res?.profileToken) {
                        // PIN이 필요 없는 경우 바로 로그인 처리
                        handleLoginSuccess(profile, res.profileToken)
                    }
                },
                onError: () => alert('프로필 접근 중 오류가 발생했습니다.'),
            })
        },
        [checkAccess, handleLoginSuccess],
    )

    const handlePinVerify = useCallback(
        (pin: string) => {
            if (!selectedProfile) return

            const param = {
                profileId: selectedProfile.profileId,
                request: {
                    pin,
                },
            }

            verifyPin(param, {
                onSuccess: (res) => {
                    if (res?.profileToken) {
                        handleLoginSuccess(selectedProfile, res.profileToken)
                    } else {
                        alert('비밀번호가 틀렸습니다.')
                    }
                },
                onError: () => alert('인증 중 오류가 발생했습니다.'),
            })
        },
        [verifyPin, selectedProfile, handleLoginSuccess],
    )

    // 로딩 처리
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
                onProfileSelect={handleProfileSelect}
                onAddProfile={() => {
                    // 프로필 생성 페이지 이동 로직 (필요 시 추가)
                    console.log('프로필 추가 클릭')
                }}
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
