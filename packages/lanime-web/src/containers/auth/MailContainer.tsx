import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCheckEmailMutation, useSigninMutation } from '@libs/apis/auth'
import MailForm from '@components/auth/MailForm'
import SignupConfirmModal from '@components/auth/SignupConfirmModal'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const MailContainer = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [mail, setMail] = useState(location.state?.mail || '')
    const [password, setPassword] = useState('')
    const [isRegistered, setIsRegistered] = useState(false)
    const [error, setError] = useState('')
    const [showSignupModal, setShowSignupModal] = useState(false)

    const { mutate: checkEmail, isPending: isCheckMailPending } =
        useCheckEmailMutation()
    const { mutate: signin, isPending: isSigninPending } = useSigninMutation()

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)
    const isButtonDisabled =
        !isEmailValid ||
        isCheckMailPending ||
        isSigninPending ||
        (isRegistered && !password)

    const handleCheckEmail = useCallback(() => {
        if (!isEmailValid) return
        checkEmail(
            { email: mail },
            {
                onSuccess: (data) => {
                    setError('')
                    setIsRegistered(data?.isRegistered || false)
                },
                onError: (err) => {
                    const message = axios.isAxiosError(err)
                        ? err.response?.data?.message
                        : t('auth.unknownError')
                    setError(message || t('auth.serverError'))
                },
            },
        )
    }, [mail, isEmailValid, checkEmail, t])

    const handleSubmit = () => {
        if (isRegistered) {
            signin(
                { email: mail, password },
                {
                    onSuccess: () => navigate('/profile'),
                    onError: () =>
                        setError(t('auth.loginFailed')),
                },
            )
        } else {
            setShowSignupModal(true)
        }
    }

    useEffect(() => {
        if (isEmailValid) handleCheckEmail()
        else setIsRegistered(false)
    }, [mail, isEmailValid, handleCheckEmail])

    return (
        <>
            <MailForm
                mail={mail}
                password={password}
                isRegistered={isRegistered}
                error={error}
                isButtonDisabled={isButtonDisabled}
                onMailChange={(e) => setMail(e.target.value)}
                onPasswordChange={(e) => setPassword(e.target.value)}
                onSubmit={handleSubmit}
                isLoading={isCheckMailPending || isSigninPending}
            />
            {showSignupModal && (
                <SignupConfirmModal
                    onClose={() => setShowSignupModal(false)}
                    onConfirm={() =>
                        navigate('/auth/signup', { state: { mail } })
                    }
                />
            )}
        </>
    )
}

export default MailContainer
