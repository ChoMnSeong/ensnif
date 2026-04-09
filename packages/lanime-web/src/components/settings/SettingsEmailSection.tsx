import React, { useState } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Input from '@components/common/Input'
import Button from '@components/common/Button'
import { useTranslation } from 'react-i18next'

interface SettingsEmailSectionProps {
    currentEmail?: string
    onSendCode: (email: string) => void
    onVerify: (newEmail: string, code: string) => void
    isSending: boolean
    isVerifying: boolean
}

const SettingsEmailSection: React.FC<SettingsEmailSectionProps> = ({
    currentEmail,
    onSendCode,
    onVerify,
    isSending,
    isVerifying,
}) => {
    const { t } = useTranslation()
    const [newEmail, setNewEmail] = useState('')
    const [code, setCode] = useState('')
    const [codeSent, setCodeSent] = useState(false)

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)

    const handleSend = () => {
        onSendCode(newEmail)
        setCodeSent(true)
    }

    const handleVerify = () => {
        onVerify(newEmail, code)
    }

    return (
        <Flex direction="column" gap="1rem">
            <SectionTitle>{t('settings.changeEmail')}</SectionTitle>
            {currentEmail && (
                <Text sz="smCt" color={themedPalette.text3}>
                    {t('settings.currentEmail')}:{' '}
                    <strong style={{ color: themedPalette.text2 }}>
                        {currentEmail}
                    </strong>
                </Text>
            )}
            <Flex direction="column" gap="1.25rem" width="100%" align="flex-start">
                <Flex direction="column" gap="0.5rem" width="100%" align="flex-start">
                    <Flex gap="0.75rem" align="flex-end" width="100%">
                        <Flex flex={1} style={{ minWidth: 0 }}>
                            <Input
                                label={t('settings.newEmail')}
                                type="email"
                                value={newEmail}
                                onChange={(e) => {
                                    setNewEmail(e.target.value)
                                    setCodeSent(false)
                                    setCode('')
                                }}
                                placeholder={t('settings.newEmailPlaceholder')}
                            />
                        </Flex>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleSend}
                            disabled={!isEmailValid || isSending}
                            style={{ flexShrink: 0 }}
                        >
                            {isSending
                                ? t('settings.sending')
                                : codeSent
                                  ? t('settings.resend')
                                  : t('settings.sendCode')}
                        </Button>
                    </Flex>
                </Flex>

                {codeSent && (
                    <Flex direction="column" gap="0.5rem" width="100%" align="flex-start">
                        <Flex width="100%" justify="space-between" align="center">
                            <Text sz="smCt" color={themedPalette.text4}>
                                {t('settings.verificationCode')}
                            </Text>
                            <Button
                                fullWidth
                                variant="secondary"
                                size="sm"
                                onClick={handleSend}
                                disabled={isSending}
                                type="button"
                                style={{ color: themedPalette.primary2, padding: '0' }}
                            >
                                {isSending ? t('settings.sending') : t('settings.resend')}
                            </Button>
                        </Flex>
                        <Input
                            type="text"
                            placeholder={t('settings.verificationCodePlaceholder')}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && code) handleVerify()
                            }}
                        />
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleVerify}
                            disabled={!code || isVerifying}
                        >
                            {isVerifying ? t('settings.verifying') : t('settings.changeEmail')}
                        </Button>
                    </Flex>
                )}
            </Flex>
        </Flex>
    )
}

export default SettingsEmailSection

const SectionTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: ${themedPalette.text1};
    margin: 0;
`
