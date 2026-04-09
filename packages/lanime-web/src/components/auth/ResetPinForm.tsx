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

interface ResetPinFormProps {
    profileName: string
    onSubmit: (password: string) => void
    isLoading: boolean
}

const ResetPinForm: React.FC<ResetPinFormProps> = ({
    profileName,
    onSubmit,
    isLoading,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')

    return (
        <FormCard direction="column" gap="0.5rem" padding="40px 32px">
            <BackButton as="button" align="center" gap="0.375rem" onClick={() => navigate('/profile')}>
                <MdArrowBack size={20} color={themedPalette.text2} />
                <Text sz="smCt" color={themedPalette.text2}>{t('common.goBack')}</Text>
            </BackButton>

            <Text sz="mdCt" color={themedPalette.text1} margin="0.75rem 0 0 0">
                {t('auth.resetPin')}
            </Text>
            <Text sz="smCt" color={themedPalette.text3} margin="0.25rem 0 0 0">
                {t('auth.resetPinDesc', { profileName })}
            </Text>
            <Text sz="smCt" color={themedPalette.text3}>
                {t('auth.resetPinDesc2')}
            </Text>

            <Flex width="100%" direction="column" margin="2rem 0 1rem 0">
                <Input
                    label={t('auth.accountPassword')}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.accountPasswordPlaceholder')}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && password) onSubmit(password)
                    }}
                />
            </Flex>

            <Button
                variant="primary"
                fullWidth
                disabled={!password || isLoading}
                onClick={() => onSubmit(password)}
                type="button"
            >
                {isLoading ? t('common.processing') : t('auth.resetPin')}
            </Button>
        </FormCard>
    )
}

export default ResetPinForm

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
