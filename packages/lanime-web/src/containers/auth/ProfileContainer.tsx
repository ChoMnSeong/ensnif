import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import {
    useProfilesQuery,
    useCheckProfileAccessMutation,
    useVerifyProfilePinMutation,
    useCreateProfileMutation,
} from '@libs/apis/auth'
import { setUserProfile } from '@stores/auth/reducer'
import customCookie from '@libs/customCookie'
import { IUserProfile, IProfileCreateRequest } from '@libs/apis/auth/type'
import { toast } from 'sonner'
import ProfilePresenter from '@components/auth/ProfilePresenter'

export interface ProfileModalProps<T> {
    onClose: () => void
    onComplete: (data: T) => void
}

const ProfileContainer = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { data: profiles = [], isLoading } = useProfilesQuery()
    const [selectedProfile, setSelectedProfile] = useState<IUserProfile | null>(
        null,
    )
    const [isPinModalOpen, setIsPinModalOpen] = useState(false)
    const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false)

    const { mutate: checkAccess } = useCheckProfileAccessMutation()
    const { mutate: verifyPin } = useVerifyProfilePinMutation()
    const { mutate: createProfile } = useCreateProfileMutation()

    const handleLoginSuccess = useCallback(
        (profile: IUserProfile, token: string) => {
            customCookie.set.profileToken(token)
            dispatch(
                setUserProfile({
                    nickname: profile.name,
                    avatarUrl: profile.avatarUrl,
                    profileId: profile.profileId,
                }),
            )
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
                        setIsPinModalOpen(true)
                    } else if (res?.profileToken) {
                        handleLoginSuccess(profile, res.profileToken)
                    }
                },
                onError: () =>
                    toast.error('프로필 접근 중 오류가 발생했습니다.'),
            })
        },
        [checkAccess, handleLoginSuccess],
    )

    const handlePinVerify = useCallback(
        (pin: string) => {
            if (!selectedProfile) return
            verifyPin(
                {
                    profileId: selectedProfile.profileId,
                    request: { pin },
                },
                {
                    onSuccess: (res) => {
                        if (res?.profileToken) {
                            handleLoginSuccess(
                                selectedProfile,
                                res.profileToken,
                            )
                        } else {
                            toast.error('비밀번호가 틀렸습니다.')
                        }
                    },
                    onError: () => toast.error('인증 중 오류가 발생했습니다.'),
                },
            )
        },
        [verifyPin, selectedProfile, handleLoginSuccess],
    )

    const handleCreateProfile = useCallback(
        (request: IProfileCreateRequest) => {
            createProfile(request, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['profiles'] })
                    setIsAddProfileModalOpen(false)
                },
                onError: () =>
                    toast.error('프로필 생성 중 오류가 발생했습니다.'),
            })
        },
        [createProfile, queryClient],
    )

    const handleForgotPin = useCallback(() => {
        if (!selectedProfile) return
        navigate('/profile/reset-pin', {
            state: {
                profileId: selectedProfile.profileId,
                profileName: selectedProfile.name,
            },
        })
    }, [navigate, selectedProfile])

    return (
        <ProfilePresenter
            profiles={profiles}
            isLoading={isLoading}
            isPinModalOpen={isPinModalOpen}
            isAddProfileModalOpen={isAddProfileModalOpen}
            onProfileSelect={handleProfileSelect}
            onPinVerify={handlePinVerify}
            onForgotPin={handleForgotPin}
            onCreateProfile={handleCreateProfile}
            onClosePinModal={() => setIsPinModalOpen(false)}
            onCloseAddModal={() => setIsAddProfileModalOpen(false)}
            onOpenAddModal={() => setIsAddProfileModalOpen(true)}
        />
    )
}

export default ProfileContainer
