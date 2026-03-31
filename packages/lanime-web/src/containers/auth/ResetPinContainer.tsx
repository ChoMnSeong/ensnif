import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { useResetProfilePinMutation } from '@libs/apis/auth'
import ResetPinForm from '@components/auth/ResetPinForm'

interface LocationState {
    profileId: string
    profileName: string
}

const ResetPinContainer = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as LocationState | null

    const queryClient = useQueryClient()
    const { mutate: resetPin, isPending } = useResetProfilePinMutation()

    if (!state?.profileId) {
        navigate('/profile')
        return null
    }

    const handleSubmit = (password: string) => {
        resetPin(
            { profileId: state.profileId, request: { password } },
            {
                onSuccess: () => {
                    toast.success('PIN이 초기화되었습니다. 프로필을 선택해주세요.')
                    queryClient.invalidateQueries({ queryKey: ['profiles'] })
                    navigate('/profile')
                },
                onError: (err) => {
                    const message = axios.isAxiosError(err)
                        ? err.response?.data?.message
                        : undefined
                    toast.error(message || '비밀번호가 올바르지 않습니다.')
                },
            },
        )
    }

    return (
        <ResetPinForm
            profileName={state.profileName}
            onSubmit={handleSubmit}
            isLoading={isPending}
        />
    )
}

export default ResetPinContainer
