import React, { useState } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Input from '@components/common/Input'
import Button from '@components/common/Button'

interface SettingsPasswordSectionProps {
    onSubmit: (currentPassword: string, newPassword: string) => void
    isLoading: boolean
}

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,20}$/

const SettingsPasswordSection: React.FC<SettingsPasswordSectionProps> = ({
    onSubmit,
    isLoading,
}) => {
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
            <SectionTitle>비밀번호 변경</SectionTitle>
            <Flex
                direction="column"
                gap="1.25rem"
                width="100%"
                align="flex-start"
            >
                <Input
                    label="현재 비밀번호"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="현재 비밀번호를 입력해주세요"
                />
                <Flex
                    direction="column"
                    gap="0.4rem"
                    width="100%"
                    align="flex-start"
                >
                    <Input
                        label="새 비밀번호"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="영문·숫자·특수문자 포함 8~20자"
                    />
                    {passwordInvalid && (
                        <ErrorText>
                            영문, 숫자, 특수문자(@$!%*#?&)를 각 1자 이상
                            포함해야 합니다.
                        </ErrorText>
                    )}
                </Flex>
                <Flex
                    direction="column"
                    gap="0.4rem"
                    width="100%"
                    align="flex-start"
                >
                    <Input
                        label="새 비밀번호 확인"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="새 비밀번호를 다시 입력해주세요"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSubmit()
                        }}
                    />
                    {passwordMismatch && (
                        <ErrorText>비밀번호가 일치하지 않습니다.</ErrorText>
                    )}
                </Flex>
                <Button
                    variant="primary"
                    fullWidth
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                >
                    {isLoading ? '변경 중...' : '비밀번호 변경'}
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
