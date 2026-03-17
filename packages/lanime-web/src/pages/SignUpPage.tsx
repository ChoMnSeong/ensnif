import React, { useState, ChangeEvent, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import Text from '../components/common/Text'
import Flex from '../components/common/Flex'
import { themedPalette } from '../libs/style/theme'
import HeaderLogo from '../components/header/HeaderLogo'
import {
    useSendVerificationMutation,
    useVerifyCodeMutation,
    useSignupMutation,
} from '../libs/apis/auth'
import axios from 'axios'

const SignUpPage: React.FC = () => {
    // MailPage에서 넘겨준 이메일 받기
    const location = useLocation()
    const navigate = useNavigate()
    const email = location.state?.mail || ''

    // 폼 상태 관리
    const [code, setCode] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [nickname, setNickname] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    // 진행 단계 상태 관리
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false)
    const [isVerified, setIsVerified] = useState<boolean>(false)

    // API Mutations
    const { mutate: sendCode, isPending: isSending } =
        useSendVerificationMutation()
    const { mutate: verifyCode, isPending: isVerifying } =
        useVerifyCodeMutation()
    const { mutate: signup, isPending: isSigningUp } = useSignupMutation()

    // 테마 설정
    useEffect(() => {
        const savedTheme =
            (localStorage.getItem('theme') as 'light' | 'dark') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light')
        setTheme(savedTheme)
        document.body.setAttribute('data-theme', savedTheme)
    }, [])

    // 이메일 정보 없이 접근 시 MailPage로 돌려보내기
    useEffect(() => {
        if (!email) {
            navigate('/auth/mail')
        }
    }, [email, navigate])

    // 입력 핸들러
    const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value.toUpperCase()) // 인증코드는 보통 대문자+숫자
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

    // 1. 인증번호 발송
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

    // 2. 인증번호 확인
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

    // 3. 회원가입 완료
    const handleSignup = () => {
        if (!password || !nickname) {
            setError('비밀번호와 닉네임을 모두 입력해주세요.')
            return
        }

        // 정규식 체크 (선택사항, 백엔드에서도 체크하지만 프론트에서도 해주면 좋습니다)
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
                    // 회원가입 완료 후 로그인 페이지로 이동 (이메일 넘겨주기)
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

    // 현재 상태에 따른 버튼 설정
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

    const buttonConfig = getButtonConfig()

    return (
        <PageWrapper
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <LogoWrapper>
                <HeaderLogo theme={theme} />
            </LogoWrapper>

            <FormCard direction="column">
                <Text
                    sz="mdCt"
                    color={themedPalette.text1}
                    style={{ fontWeight: 'bold' }}
                >
                    회원가입
                </Text>

                <InputSection direction="column">
                    <Text
                        sz="smCt"
                        color={themedPalette.text4}
                        style={{ marginBottom: '8px' }}
                    >
                        이메일
                    </Text>
                    <StyledInput
                        type="email"
                        value={email}
                        readOnly // 이메일은 수정 불가
                        style={{
                            color: themedPalette.text3,
                            backgroundColor: 'transparent',
                        }}
                    />

                    {/* 인증번호 입력 필드 (발송된 후 & 인증되기 전) */}
                    {isCodeSent && !isVerified && (
                        <div style={{ width: '100%', marginTop: '24px' }}>
                            <Flex
                                justifyContent="space-between"
                                alignItems="center"
                                margin="0 0 8px 0"
                            >
                                <Text sz="smCt" color={themedPalette.text4}>
                                    인증번호
                                </Text>
                                <ResendText
                                    sz="smCt"
                                    color={themedPalette.primary2}
                                    onClick={handleSendCode}
                                >
                                    재발송
                                </ResendText>
                            </Flex>
                            <StyledInput
                                type="text"
                                placeholder="5자리 인증번호 입력"
                                value={code}
                                maxLength={5}
                                onChange={handleCodeChange}
                                onKeyDown={(e) => {
                                    if (
                                        e.key === 'Enter' &&
                                        !buttonConfig.disabled
                                    )
                                        handleVerifyCode()
                                }}
                            />
                        </div>
                    )}

                    {/* 비밀번호 및 닉네임 입력 (인증 성공 후) */}
                    {isVerified && (
                        <FadeInWrapper style={{ width: '100%' }}>
                            <div style={{ width: '100%', marginTop: '24px' }}>
                                <Text
                                    sz="smCt"
                                    color={themedPalette.text4}
                                    style={{
                                        marginBottom: '8px',
                                        display: 'block',
                                    }}
                                >
                                    비밀번호
                                </Text>
                                <StyledInput
                                    type="password"
                                    placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            <div style={{ width: '100%', marginTop: '24px' }}>
                                <Text
                                    sz="smCt"
                                    color={themedPalette.text4}
                                    style={{
                                        marginBottom: '8px',
                                        display: 'block',
                                    }}
                                >
                                    닉네임
                                </Text>
                                <StyledInput
                                    type="text"
                                    placeholder="2~10자 이내 입력"
                                    value={nickname}
                                    onChange={handleNicknameChange}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === 'Enter' &&
                                            !buttonConfig.disabled
                                        )
                                            handleSignup()
                                    }}
                                />
                            </div>
                        </FadeInWrapper>
                    )}

                    {error && (
                        <Text
                            sz="smCt"
                            color={themedPalette.destructive1}
                            style={{ marginTop: '12px' }}
                        >
                            {error}
                        </Text>
                    )}
                </InputSection>

                <SubmitButton
                    disabled={buttonConfig.disabled}
                    onClick={buttonConfig.onClick}
                >
                    {buttonConfig.loading ? '처리 중...' : buttonConfig.text}
                </SubmitButton>
            </FormCard>
        </PageWrapper>
    )
}

export default SignUpPage

// ==========================
// Styled Components (MailPage와 일치)
// ==========================

const PageWrapper = styled(Flex)`
    width: 100vw;
    height: 100vh;
    background-color: ${themedPalette.bg_page1};
`

const LogoWrapper = styled.div`
    margin-bottom: 2rem;
`

const FormCard = styled(Flex)`
    width: 100%;
    max-width: 420px;
    background-color: ${themedPalette.bg_element2};
    border-radius: 8px;
    padding: 40px 32px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

const InputSection = styled(Flex)`
    width: 100%;
    margin-top: 32px;
    margin-bottom: 40px;
    align-items: flex-start;
`

const StyledInput = styled.input`
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid ${themedPalette.border2};
    color: ${themedPalette.text1};
    font-size: 1rem;
    padding: 8px 0;
    outline: none;
    transition: border-bottom-color 0.2s ease-in-out;

    &::placeholder {
        color: ${themedPalette.text4};
    }

    &:focus {
        border-bottom: 1px solid ${themedPalette.primary1};
    }

    &:read-only {
        border-bottom: 1px solid ${themedPalette.border1};
        cursor: not-allowed;
    }
`

const ResendText = styled(Text)`
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
    &:hover {
        opacity: 0.8;
    }
`

const SubmitButton = styled.button<{ disabled: boolean }>`
    width: 100%;
    padding: 14px 0;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 4px;
    border: none;
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    background-color: ${({ disabled }) =>
        disabled ? themedPalette.bg_element3 : themedPalette.primary2};
    color: ${({ disabled }) =>
        disabled ? themedPalette.text4 : themedPalette.text1};
    transition:
        background-color 0.2s,
        color 0.2s;

    &:hover {
        background-color: ${({ disabled }) =>
            disabled ? themedPalette.bg_element3 : themedPalette.primary1};
    }
`

const FadeInWrapper = styled.div`
    animation: fadeIn 0.3s ease-in-out;
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`
