import React, { useState } from 'react'
import { themedPalette } from '../../libs/style/theme'
import Flex from '../common/Flex'
import Text from '../common/Text'
import PinInput from '../common/PinInput'
import ProfileModalLayout from './ProfileModalLayout'
import { ProfileModalProps } from '../../containers/auth/ProfileContainer'

const PinInputModal: React.FC<ProfileModalProps<string>> = ({
    onClose,
    onComplete,
}) => {
    const [pins, setPins] = useState(['', '', '', ''])

    return (
        <ProfileModalLayout onClose={onClose}>
            <Flex direction="column" alignItems="center">
                <Text sz="lgTl" color={themedPalette.text1} margin="0 0 4rem 0">
                    프로필 비밀번호를 입력해주세요
                </Text>

                <PinInput
                    value={pins}
                    onChange={setPins}
                    onComplete={onComplete}
                    size="lg"
                />

                <Text
                    sz="smCt"
                    color={themedPalette.text4}
                    hoverColor={themedPalette.text2}
                    margin="4rem 0 0 0"
                    style={{
                        cursor: 'pointer',
                        borderBottom: `1px solid ${themedPalette.text4}`,
                    }}
                >
                    프로필 비밀번호를 잊으셨나요? 〉
                </Text>
            </Flex>
        </ProfileModalLayout>
    )
}

export default PinInputModal
