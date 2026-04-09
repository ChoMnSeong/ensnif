import { useState } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Input from '@components/common/Input'
import Button from '@components/common/Button'
import { useTranslation } from 'react-i18next'

interface ResetPasswordFormProps {
    email: string
    onSubmit: (token: string, newPassword: string) => void
    onResend: () => void
    isLoading: boolean
    isSending: boolean
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
    email,
    onSubmit,
    onResend,
    isLoading,
    isSending,
}) => {
    const { t } = useTranslation()
    const [token, setToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword
    const isDisabled = !token || !newPassword || !confirmPassword || passwordMismatch || isLoading

    return (
        <FormCard direction="column" gap="0.5rem" padding="40px 32px">
            <Text sz="mdCt" color={themedPalette.text1} style={{ fontWeight: 'bold' }}>
                {t('auth.resetPassword')}
            </Text>
            <Text sz="smCt" color={themedPalette.text4} margin="0.25rem 0 0 0">
                <strong style={{ color: themedPalette.text2 }}>{email}</strong>{' '}
                로 코드를 전송했습니다.
            </Text>

            <Flex width="100%" direction="column" margin="2rem 0 2.5rem 0" gap="1.5rem">
                <Flex direction="column" width="100%" gap="8px">
                    <Flex width="100%" justify="space-between" align="center">
                        <Text sz="smCt" color={themedPalette.text4}>
                            {t('auth.verificationToken')}
                        </Text>
                        <ResendText
                            sz="smCt"
                            color={themedPalette.primary2}
                            onClick={onResend}
                            style={{ cursor: 'pointer', opacity: isSending ? 0.5 : 1 }}
                        >
                            {isSending ? t('auth.resending') : t('auth.resendCode')}
                        </ResendText>
                    </Flex>
                    <Input
                        type="text"
                        placeholder={t('auth.tokenPlaceholder')}
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                </Flex>

                <Input
                    label={t('auth.newPassword')}
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t('auth.newPasswordPlaceholder')}
                />

                <Flex direction="column" align="flex-start" width="100%" gap="8px">
                    <Input
                        label={t('auth.confirmPassword')}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isDisabled) onSubmit(token, newPassword)
                        }}
                    />
                    {passwordMismatch && (
                        <ErrorMessage>{t('auth.passwordMismatch')}</ErrorMessage>
                    )}
                </Flex>
            </Flex>

            <Button
                variant="primary"
                fullWidth
                disabled={isDisabled}
                onClick={() => onSubmit(token, newPassword)}
                type="button"
            >
                {isLoading ? t('common.processing') : t('auth.changePassword')}
            </Button>
        </FormCard>
    )
}

export default ResetPasswordForm

const FormCard = styled(Flex)`
    width: 100%;
    max-width: 420px;
    background-color: ${themedPalette.bg_element1};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

const ResendText = styled(Text)`
    text-decoration: underline;
    text-underline-offset: 2px;
    &:hover { opacity: 0.8; }
`

const ErrorMessage = styled.div`
    color: ${themedPalette.destructive1};
    font-size: 0.85rem;
`
