import React, { useState } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Input from '@components/common/Input'
import Button from '@components/common/Button'

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
            <SectionTitle>이메일 변경</SectionTitle>
            {currentEmail && (
                <Text sz="smCt" color={themedPalette.text3}>
                    현재 이메일:{' '}
                    <strong style={{ color: themedPalette.text2 }}>
                        {currentEmail}
                    </strong>
                </Text>
            )}
            <Flex
                direction="column"
                gap="1.25rem"
                width="100%"
                align="flex-start"
            >
                <Flex
                    direction="column"
                    gap="0.5rem"
                    width="100%"
                    align="flex-start"
                >
                    <Flex gap="0.75rem" align="flex-end" width="100%">
                        <Flex flex={1} style={{ minWidth: 0 }}>
                            <Input
                                label="새 이메일"
                                type="email"
                                value={newEmail}
                                onChange={(e) => {
                                    setNewEmail(e.target.value)
                                    setCodeSent(false)
                                    setCode('')
                                }}
                                placeholder="새 이메일을 입력해주세요"
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
                                ? '전송 중...'
                                : codeSent
                                  ? '재전송'
                                  : '인증 코드 전송'}
                        </Button>
                    </Flex>
                </Flex>

                {codeSent && (
                    <Flex
                        direction="column"
                        gap="0.5rem"
                        width="100%"
                        align="flex-start"
                    >
                        <Flex
                            width="100%"
                            justify="space-between"
                            align="center"
                        >
                            <Text sz="smCt" color={themedPalette.text4}>
                                인증 코드
                            </Text>
                            <Button
                                fullWidth
                                variant="secondary"
                                size="sm"
                                onClick={handleSend}
                                disabled={isSending}
                                type="button"
                                style={{
                                    color: themedPalette.primary2,
                                    padding: '0',
                                }}
                            >
                                {isSending ? '전송 중...' : '재전송'}
                            </Button>
                        </Flex>
                        <Input
                            type="text"
                            placeholder="이메일로 받은 코드를 입력해주세요"
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
                            {isVerifying ? '확인 중...' : '이메일 변경'}
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
