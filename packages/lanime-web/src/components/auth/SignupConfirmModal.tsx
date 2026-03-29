import React from 'react'
import styled from '@emotion/styled'
import Text from '@components/common/Text'
import Flex from '@components/common/Flex'
import Button from '@components/common/Button'
import { themedPalette } from '@libs/style/theme'

interface SignupConfirmModalProps {
    onClose: () => void
    onConfirm: () => void
}

const SignupConfirmModal: React.FC<SignupConfirmModalProps> = ({
    onClose,
    onConfirm,
}) => {
    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent
                direction="column"
                alignItems="center"
                onClick={(e) => e.stopPropagation()}
            >
                <Text
                    sz="mdCt"
                    color={themedPalette.text1}
                    style={{ marginBottom: '16px', fontWeight: 'bold' }}
                >
                    회원가입 가능한 메일입니다
                </Text>
                <Text
                    sz="smCt"
                    color={themedPalette.text4}
                    style={{
                        marginBottom: '32px',
                        textAlign: 'center',
                    }}
                >
                    입력하신 이메일로
                    <br />
                    회원가입을 진행하시겠습니까?
                </Text>
                <Flex width={'100%'} gap={'12px'}>
                    <Button variant="secondary" style={{ flex: 1 }} onClick={onClose} type="button">닫기</Button>
                    <Button variant="primary" style={{ flex: 1 }} onClick={onConfirm} type="button">
                        회원가입
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
    justify-content: center;
    align-items: center;
`

const ModalContent = styled(Flex)`
    background-color: ${themedPalette.bg_element2};
    padding: 32px;
    border-radius: 12px;
    width: 320px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`
