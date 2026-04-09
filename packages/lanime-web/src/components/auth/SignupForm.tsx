import React, { ChangeEvent } from 'react'
import styled from '@emotion/styled'
import Text from '@components/common/Text'
import Flex from '@components/common/Flex'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import { themedPalette } from '@libs/style/theme'
import { useTranslation } from 'react-i18next'

interface ButtonConfig {
    text: string
    disabled: boolean
    loading: boolean
    onClick: () => void
}

interface SignupFormProps {
    email: string
    code: string
    password: string
    nickname: string
    error: string
    isCodeSent: boolean
    isVerified: boolean
    buttonConfig: ButtonConfig
    onCodeChange: (e: ChangeEvent<HTMLInputElement>) => void
    onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void
    onNicknameChange: (e: ChangeEvent<HTMLInputElement>) => void
    onSendCode: () => void
    onVerifyCode: () => void
    onSignup: () => void
}

const SignupForm: React.FC<SignupFormProps> = ({
    email,
    code,
    password,
    nickname,
    error,
    isCodeSent,
    isVerified,
    buttonConfig,
    onCodeChange,
    onPasswordChange,
    onNicknameChange,
    onSendCode,
    onVerifyCode,
    onSignup,
}) => {
    const { t } = useTranslation()

    return (
        <FormCard direction="column" gap="0.5rem" width="100%" padding="40px 32px">
            <Text sz="mdCt" color={themedPalette.text1} style={{ fontWeight: 'bold' }}>
                {t('auth.signup')}
            </Text>

            <Flex width="100%" direction="column" margin="2rem 0 2.5rem 0" gap="1.5rem">
                <Input label={t('auth.email')} type="email" value={email} readOnly />

                {isCodeSent && !isVerified && (
                    <Flex direction="column" width="100%" gap="8px">
                        <Flex width="100%" justify="space-between" align="center">
                            <Text sz="smCt" color={themedPalette.text4}>
                                {t('auth.verificationCode')}
                            </Text>
                            <ResendText sz="smCt" color={themedPalette.primary2} onClick={onSendCode}>
                                {t('auth.resend')}
                            </ResendText>
                        </Flex>
                        <Input
                            type="text"
                            placeholder={t('auth.codePlaceholder')}
                            value={code}
                            maxLength={5}
                            onChange={onCodeChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !buttonConfig.disabled) onVerifyCode()
                            }}
                        />
                    </Flex>
                )}

                {isVerified && (
                    <FadeInWrapper direction="column" gap="1.5rem" width="100%">
                        <Input
                            label={t('auth.password')}
                            type="password"
                            placeholder={t('auth.passwordPlaceholder')}
                            value={password}
                            onChange={onPasswordChange}
                        />
                        <Input
                            label={t('auth.nickname')}
                            type="text"
                            placeholder={t('auth.nicknamePlaceholder')}
                            value={nickname}
                            onChange={onNicknameChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !buttonConfig.disabled) onSignup()
                            }}
                        />
                    </FadeInWrapper>
                )}

                {error && (
                    <Text sz="smCt" color={themedPalette.destructive1}>
                        {error}
                    </Text>
                )}
            </Flex>

            <Button
                variant="primary"
                fullWidth
                disabled={buttonConfig.disabled}
                onClick={buttonConfig.onClick}
                type="button"
            >
                {buttonConfig.loading ? t('common.processing') : buttonConfig.text}
            </Button>
        </FormCard>
    )
}

export default SignupForm

const FormCard = styled(Flex)`
    max-width: 420px;
    background-color: ${themedPalette.bg_element1};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

const ResendText = styled(Text)`
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
    &:hover {
        opacity: 0.8;
    }
`

const FadeInWrapper = styled(Flex)`
    animation: fadeIn 0.3s ease-in-out;
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to   { opacity: 1; transform: translateY(0); }
    }
`
