import { useState, ChangeEvent, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    useSendVerificationMutation,
    useVerifyCodeMutation,
    useSignupMutation,
} from '@libs/apis/auth'
import SignupForm from '@components/auth/SignupForm'
import axios from 'axios'

const SignupContainer = () => {
    const location = useLocation()
    const navigate = useNavigate()
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
                        setError('인증번호 발송에 실패했습니다.')
                    }
                },
            },
        )
    }

    const handleVerifyCode = () => {
        if (!code || code.length < 5) {
            setError('올바른 인증번호 5자리를 입력해주세요.')
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
                        setError('인증번호가 일치하지 않습니다.')
                    }
                },
                onError: (err) => {
                    if (
                        axios.isAxiosError(err) &&
                        err.response?.data?.message
                    ) {
                        setError(err.response.data.message)
                    } else {
                        setError('인증번호 확인에 실패했습니다.')
                    }
                },
            },
        )
    }

    const handleSignup = () => {
        if (!password || !nickname) {
            setError('비밀번호와 닉네임을 모두 입력해주세요.')
            return
        }

        const pwRegex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/
        if (!pwRegex.test(password)) {
            setError('비밀번호는 영문, 숫자, 특수문자 포함 8~20자여야 합니다.')
            return
        }
        if (nickname.length < 2 || nickname.length > 10) {
            setError('닉네임은 2~10자로 입력해주세요.')
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
                        setError('회원가입 처리 중 오류가 발생했습니다.')
                    }
                },
            },
        )
    }

    const getButtonConfig = () => {
        if (!isVerified) {
            if (!isCodeSent) {
                return {
                    text: '인증번호 받기',
                    onClick: handleSendCode,
                    disabled: isSending,
                    loading: isSending,
                }
            }
            return {
                text: '인증 확인',
                onClick: handleVerifyCode,
                disabled: isVerifying || code.length < 5,
                loading: isVerifying,
            }
        }
        return {
            text: '가입 완료',
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
