import { useState, ChangeEvent, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    useSendVerificationMutation,
    useVerifyCodeMutation,
    useSignupMutation,
} from '@libs/apis/auth'
import SignupForm from '@components/auth/SignupForm'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const SignupContainer = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const email = location.state?.mail || ''

    const [code, setCode] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [nickname, setNickname] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false)
    const [isVerified, setIsVerified] = useState<boolean>(false)

    const { mutate: sendCode, isPending: isSending } =
        useSendVerificationMutation()
    const { mutate: verifyCode, isPending: isVerifying } =
        useVerifyCodeMutation()
    const { mutate: signup, isPending: isSigningUp } = useSignupMutation()

    useEffect(() => {
        if (!email) {
            navigate('/auth/mail')
        }
    }, [email, navigate])

    const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value.toUpperCase())
        if (error) setError('')
    }

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        if (error) setError('')
    }

    const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value)
        if (error) setError('')
    }

    const handleSendCode = () => {
        setError('')
        sendCode(
            { email },
            {
                onSuccess: () => {
                    setIsCodeSent(true)
                },
                onError: (err) => {
                    if (
                        axios.isAxiosError(err) &&
                        err.response?.data?.message
                    ) {
                        setError(err.response.data.message)
                    } else {
                        setError(t('auth.codeSendFailed'))
                    }
                },
            },
        )
    }

    const handleVerifyCode = () => {
        if (!code || code.length < 5) {
            setError(t('auth.codeInvalid'))
            return
        }

        setError('')
        verifyCode(
            { email, code },
            {
                onSuccess: (isValid) => {
                    if (isValid) {
                        setIsVerified(true)
                    } else {
                        setError(t('auth.codeMismatch'))
                    }
                },
                onError: (err) => {
                    if (
                        axios.isAxiosError(err) &&
                        err.response?.data?.message
                    ) {
                        setError(err.response.data.message)
                    } else {
                        setError(t('auth.codeVerifyFailed'))
                    }
                },
            },
        )
    }

    const handleSignup = () => {
        if (!password || !nickname) {
            setError(t('auth.signupFieldsRequired'))
            return
        }

        const pwRegex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/
        if (!pwRegex.test(password)) {
            setError(t('auth.passwordFormatError'))
            return
        }
        if (nickname.length < 2 || nickname.length > 10) {
            setError(t('auth.nicknameFormatError'))
            return
        }

        setError('')
        signup(
            { email, password, nickname },
            {
                onSuccess: () => {
                    navigate('/auth/mail', {
                        state: { mail: email },
                        replace: true,
                    })
                },
                onError: (err) => {
                    if (
                        axios.isAxiosError(err) &&
                        err.response?.data?.message
                    ) {
                        setError(err.response.data.message)
                    } else {
                        setError(t('auth.signupError'))
                    }
                },
            },
        )
    }

    const getButtonConfig = () => {
        if (!isVerified) {
            if (!isCodeSent) {
                return {
                    text: t('auth.sendCode'),
                    onClick: handleSendCode,
                    disabled: isSending,
                    loading: isSending,
                }
            }
            return {
                text: t('auth.verifyCode'),
                onClick: handleVerifyCode,
                disabled: isVerifying || code.length < 5,
                loading: isVerifying,
            }
        }
        return {
            text: t('auth.signupComplete'),
            onClick: handleSignup,
            disabled: isSigningUp || !password || !nickname,
            loading: isSigningUp,
        }
    }

    return (
        <SignupForm
            email={email}
            code={code}
            password={password}
            nickname={nickname}
            error={error}
            isCodeSent={isCodeSent}
            isVerified={isVerified}
            buttonConfig={getButtonConfig()}
            onCodeChange={handleCodeChange}
            onPasswordChange={handlePasswordChange}
            onNicknameChange={handleNicknameChange}
            onSendCode={handleSendCode}
            onVerifyCode={handleVerifyCode}
            onSignup={handleSignup}
        />
    )
}

export default SignupContainer
