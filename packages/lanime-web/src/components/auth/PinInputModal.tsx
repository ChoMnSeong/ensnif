import React, { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '../../libs/style/theme'
import Flex from '../common/Flex'
import Text from '../common/Text'
import TextButton from '../common/TextButton'

interface PinInputModalProps {
    onClose: () => void
    onComplete: (pin: string) => void
}

const PinInputModal: React.FC<PinInputModalProps> = ({
    onClose,
    onComplete,
}) => {
    const [pins, setPins] = useState(['', '', '', ''])
    const inputRefs = useRef<HTMLInputElement[]>([])

    useEffect(() => {
        if (pins.every((p) => p !== '')) {
            onComplete(pins.join(''))
        }
    }, [pins, onComplete])

    const handleInputChange = (val: string, idx: number) => {
        if (!/^\d*$/.test(val)) return
        const newPins = [...pins]
        newPins[idx] = val.slice(-1)
        setPins(newPins)
        if (val && idx < 3) inputRefs.current[idx + 1]?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
        if (e.key === 'Backspace' && !pins[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus()
        }
    }

    return (
        <ModalOverlay>
            <CloseButton>
                <TextButton
                    onClick={onClose}
                    disabled={false}
                    type="button"
                    color={themedPalette.button_text}
                    sz="large"
                    active={false}
                >
                    ✕
                </TextButton>
            </CloseButton>
            <Flex
                direction="column"
                alignItems="center"
                gap="3rem"
                onClick={(e) => e.stopPropagation()}
            >
                <Text sz="lgTl" color={themedPalette.text1}>
                    프로필 비밀번호를 입력해주세요
                </Text>
                <Flex alignItems="center" gap="1rem">
                    {pins.map((digit, i) => (
                        <PinBox
                            key={i}
                            type="password"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                                handleInputChange(e.target.value, i)
                            }
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            ref={(el) => {
                                inputRefs.current[i] = el as HTMLInputElement
                            }}
                            autoFocus={i === 0}
                        />
                    ))}
                </Flex>
                <Text
                    sz="smCt"
                    color={themedPalette.text4}
                    hoverColor={themedPalette.text3}
                    style={{ cursor: 'pointer' }}
                >
                    프로필 비밀번호를 잊으셨나요? 〉
                </Text>
            </Flex>
        </ModalOverlay>
    )
}

export default PinInputModal

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background-color: ${themedPalette.bg_page2};
    z-index: 2000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
const CloseButton = styled.div`
    position: absolute;
    top: 40px;
    right: 40px;
    cursor: pointer;
`
const PinBox = styled.input`
    width: 70px;
    height: 90px;
    background-color: ${themedPalette.bg_element2};
    border: 1px solid ${themedPalette.border1};
    border-radius: 4px;
    color: ${themedPalette.text1};
    font-size: 36px;
    text-align: center;
    outline: none;
    &:focus {
        border-color: ${themedPalette.border2};
        background-color: ${themedPalette.bg_element3};
    }
`
