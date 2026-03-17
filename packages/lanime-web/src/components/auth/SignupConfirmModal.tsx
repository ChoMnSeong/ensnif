import React from 'react'
import styled from '@emotion/styled'
import Text from '../common/Text'
import Flex from '../common/Flex'
import { themedPalette } from '../../libs/style/theme'

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
                    <ModalButton onClick={onClose}>닫기</ModalButton>
                    <ModalButton isPrimary={true} onClick={onConfirm}>
                        회원가입
                    </ModalButton>
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

const ModalButton = styled.button<{ isPrimary?: boolean }>`
    flex: 1;
    padding: 12px 0;
    border-radius: 6px;
    border: none;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    background-color: ${({ isPrimary }) =>
        isPrimary ? themedPalette.primary2 : themedPalette.bg_element3};
    color: ${({ isPrimary }) =>
        isPrimary ? themedPalette.text1 : themedPalette.text2};
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.8;
    }
`
