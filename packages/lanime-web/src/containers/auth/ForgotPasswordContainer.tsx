import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { useForgotPasswordMutation, useResetPasswordMutation } from '@libs/apis/auth'
import ForgotPasswordForm from '@components/auth/ForgotPasswordForm'
import ResetPasswordForm from '@components/auth/ResetPasswordForm'

const ForgotPasswordContainer = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState<'email' | 'reset'>('email')
    const [email, setEmail] = useState('')

    const { mutate: forgotPassword, isPending: isSending } =
        useForgotPasswordMutation()
    const { mutate: resetPassword, isPending: isResetting } =
        useResetPasswordMutation()

    const handleSendCode = (inputEmail: string) => {
        forgotPassword(
            { email: inputEmail },
            {
                onSuccess: () => {
                    setEmail(inputEmail)
                    setStep('reset')
                    toast.success('재설정 코드가 이메일로 전송되었습니다.')
                },
                onError: (err) => {
                    const message = axios.isAxiosError(err)
                        ? err.response?.data?.message
                        : undefined
                    toast.error(message || '이메일 전송에 실패했습니다.')
                },
            },
        )
    }

    const handleResetPassword = (token: string, newPassword: string) => {
        resetPassword(
            { email, token, newPassword },
            {
                onSuccess: () => {
                    toast.success('비밀번호가 변경되었습니다. 다시 로그인해주세요.')
                    navigate('/auth/mail', { state: { mail: email } })
                },
                onError: (err) => {
                    const message = axios.isAxiosError(err)
                        ? err.response?.data?.message
                        : undefined
                    toast.error(message || '비밀번호 재설정에 실패했습니다.')
                },
            },
        )
    }

    if (step === 'reset') {
        return (
            <ResetPasswordForm
                email={email}
                onSubmit={handleResetPassword}
                onResend={() => handleSendCode(email)}
                isLoading={isResetting}
                isSending={isSending}
            />
        )
    }

    return (
        <ForgotPasswordForm
            onSubmit={handleSendCode}
            isLoading={isSending}
        />
    )
}

export default ForgotPasswordContainer
