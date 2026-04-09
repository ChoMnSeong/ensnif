import React, { useState } from 'react'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Button from '@components/common/Button'
import PinInput from '@components/common/PinInput'
import ProfileModalLayout from '@components/auth/ProfileModalLayout'
import { ProfileModalProps } from '@containers/auth/ProfileContainer'
import { useTranslation } from 'react-i18next'

interface PinInputModalProps extends ProfileModalProps<string> {
    onForgotPin: () => void
}

const PinInputModal: React.FC<PinInputModalProps> = ({
    onClose,
    onComplete,
    onForgotPin,
}) => {
    const { t } = useTranslation()
    const [pins, setPins] = useState(['', '', '', ''])

    return (
        <ProfileModalLayout onClose={onClose}>
            <Flex direction="column" align="center">
                <Text sz="lgTl" color={themedPalette.text1} margin="0 0 4rem 0">
                    {t('auth.enterPin')}
                </Text>

                <PinInput value={pins} onChange={setPins} onComplete={onComplete} size="lg" />

                <Button
                    variant="text"
                    size="sm"
                    type="button"
                    style={{ marginTop: '4rem' }}
                    onClick={onForgotPin}
                >
                    {t('auth.forgotPin')}
                </Button>
            </Flex>
        </ProfileModalLayout>
    )
}

export default PinInputModal
