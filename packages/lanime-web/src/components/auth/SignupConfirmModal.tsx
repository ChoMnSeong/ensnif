import React from 'react'
import styled from '@emotion/styled'
import Text from '@components/common/Text'
import Flex from '@components/common/Flex'
import Button from '@components/common/Button'
import { themedPalette } from '@libs/style/theme'
import { useTranslation } from 'react-i18next'

interface SignupConfirmModalProps {
    onClose: () => void
    onConfirm: () => void
}

const SignupConfirmModal: React.FC<SignupConfirmModalProps> = ({
    onClose,
    onConfirm,
}) => {
    const { t } = useTranslation()

    return (
        <ModalOverlay justify="center" align="center" onClick={onClose}>
            <ModalContent
                direction="column"
                align="center"
                padding="32px"
                onClick={(e) => e.stopPropagation()}
            >
                <Text
                    sz="mdCt"
                    color={themedPalette.text1}
                    style={{ marginBottom: '16px', fontWeight: 'bold' }}
                >
                    {t('auth.validEmail')}
                </Text>
                <Text
                    sz="smCt"
                    color={themedPalette.text4}
                    style={{ marginBottom: '32px', textAlign: 'center' }}
                >
                    {t('auth.confirmSignupDesc').split('\n').map((line, i) => (
                        <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
                    ))}
                </Text>
                <Flex width="100%" gap="12px">
                    <Button variant="secondary" style={{ flex: 1 }} onClick={onClose} type="button">
                        {t('common.close')}
                    </Button>
                    <Button variant="primary" style={{ flex: 1 }} onClick={onConfirm} type="button">
                        {t('auth.signup')}
                    </Button>
                </Flex>
            </ModalContent>
        </ModalOverlay>
    )
}

export default SignupConfirmModal

const ModalOverlay = styled(Flex)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
`

const ModalContent = styled(Flex)`
    background-color: ${themedPalette.bg_element2};
    border-radius: 12px;
    width: 320px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`
