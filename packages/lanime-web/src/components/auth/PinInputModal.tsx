import React, { useState } from 'react'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Button from '@components/common/Button'
import PinInput from '@components/common/PinInput'
import ProfileModalLayout from '@components/auth/ProfileModalLayout'
import { ProfileModalProps } from '@containers/auth/ProfileContainer'

interface PinInputModalProps extends ProfileModalProps<string> {
    onForgotPin: () => void
}

const PinInputModal: React.FC<PinInputModalProps> = ({
    onClose,
    onComplete,
    onForgotPin,
}) => {
    const [pins, setPins] = useState(['', '', '', ''])

    return (
        <ProfileModalLayout onClose={onClose}>
            <Flex direction="column" align="center">
                <Text sz="lgTl" color={themedPalette.text1} margin="0 0 4rem 0">
                    프로필 비밀번호를 입력해주세요
                </Text>

                <PinInput
                    value={pins}
                    onChange={setPins}
                    onComplete={onComplete}
                    size="lg"
                />

                <Button
                    variant="text"
                    size="sm"
                    type="button"
                    style={{ marginTop: '4rem' }}
                    onClick={onForgotPin}
                >
                    프로필 비밀번호를 잊으셨나요? 〉
                </Button>
            </Flex>
        </ProfileModalLayout>
    )
}

export default PinInputModal
