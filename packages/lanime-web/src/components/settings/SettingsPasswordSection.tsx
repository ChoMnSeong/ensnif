import React, { useState } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Input from '@components/common/Input'
import Button from '@components/common/Button'
import { useTranslation } from 'react-i18next'

interface SettingsPasswordSectionProps {
    onSubmit: (currentPassword: string, newPassword: string) => void
    isLoading: boolean
}

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,20}$/

const SettingsPasswordSection: React.FC<SettingsPasswordSectionProps> = ({
    onSubmit,
    isLoading,
}) => {
    const { t } = useTranslation()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const passwordMismatch =
        confirmPassword.length > 0 && newPassword !== confirmPassword
    const passwordInvalid =
        newPassword.length > 0 && !PASSWORD_REGEX.test(newPassword)
    const isDisabled =
        !currentPassword ||
        !newPassword ||
        !confirmPassword ||
        passwordMismatch ||
        passwordInvalid ||
        isLoading

    const handleSubmit = () => {
        if (isDisabled) return
        onSubmit(currentPassword, newPassword)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
    }

    return (
        <Flex direction="column" gap="1rem">
            <SectionTitle>{t('settings.changePassword')}</SectionTitle>
            <Flex direction="column" gap="1.25rem" width="100%" align="flex-start">
                <Input
                    label={t('settings.currentPassword')}
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={t('settings.currentPasswordPlaceholder')}
                />
                <Flex direction="column" gap="0.4rem" width="100%" align="flex-start">
                    <Input
                        label={t('settings.newPassword')}
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t('settings.newPasswordPlaceholder')}
                    />
                    {passwordInvalid && (
                        <ErrorText>{t('settings.passwordFormatError')}</ErrorText>
                    )}
                </Flex>
                <Flex direction="column" gap="0.4rem" width="100%" align="flex-start">
                    <Input
                        label={t('settings.confirmNewPassword')}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('settings.confirmNewPasswordPlaceholder')}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSubmit()
                        }}
                    />
                    {passwordMismatch && (
                        <ErrorText>{t('settings.passwordMismatch')}</ErrorText>
                    )}
                </Flex>
                <Button
                    variant="primary"
                    fullWidth
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                >
                    {isLoading ? t('settings.changing') : t('settings.changePassword')}
                </Button>
            </Flex>
        </Flex>
    )
}

export default SettingsPasswordSection

const SectionTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: ${themedPalette.text1};
    margin: 0;
`

const ErrorText = styled.span`
    font-size: 0.75rem;
    color: ${themedPalette.destructive1};
`
