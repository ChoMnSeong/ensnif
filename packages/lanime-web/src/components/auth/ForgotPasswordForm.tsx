import { useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Input from '@components/common/Input'
import Button from '@components/common/Button'
import { useTranslation } from 'react-i18next'

interface ForgotPasswordFormProps {
    onSubmit: (email: string) => void
    isLoading: boolean
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    onSubmit,
    isLoading,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    return (
        <FormCard direction="column" gap="0.5rem" padding="40px 32px">
            <BackButton as="button" align="center" gap="0.375rem" onClick={() => navigate('/auth/mail')}>
                <MdArrowBack size={20} color={themedPalette.text2} />
                <Text sz="smCt" color={themedPalette.text2}>{t('common.goBack')}</Text>
            </BackButton>
            <Text sz="mdCt" color={themedPalette.text1} margin="0.75rem 0 0 0">
                {t('auth.forgotPassword')}
            </Text>
            <Text sz="smCt" color={themedPalette.text3} margin="0.5rem 0 0 0">
                {t('auth.forgotPasswordDesc')}
            </Text>

            <Flex width="100%" direction="column" margin="2rem 0 1rem 0" gap="1.5rem">
                <Input
                    label={t('auth.email')}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder')}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && isEmailValid) onSubmit(email)
                    }}
                />
            </Flex>

            <Button
                variant="primary"
                fullWidth
                disabled={!isEmailValid || isLoading}
                onClick={() => onSubmit(email)}
                type="button"
            >
                {isLoading ? t('auth.sending') : t('auth.sendResetCode')}
            </Button>
        </FormCard>
    )
}

export default ForgotPasswordForm

const FormCard = styled(Flex)`
    width: 100%;
    max-width: 420px;
    background-color: ${themedPalette.bg_element1};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

const BackButton = styled(Flex)`
    background: none;
    border: none;
    cursor: pointer;
    align-self: flex-start;
    opacity: 0.7;
    transition: opacity 0.15s ease;
    &:hover { opacity: 1; }
`
