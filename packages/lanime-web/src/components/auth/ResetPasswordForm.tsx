import { useState } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Input from '@components/common/Input'
import Button from '@components/common/Button'

interface ResetPasswordFormProps {
    email: string
    onSubmit: (token: string, newPassword: string) => void
    onResend: () => void
    isLoading: boolean
    isSending: boolean
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
    email,
    onSubmit,
    onResend,
    isLoading,
    isSending,
}) => {
    const [token, setToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const passwordMismatch =
        confirmPassword.length > 0 && newPassword !== confirmPassword
    const isDisabled =
        !token ||
        !newPassword ||
        !confirmPassword ||
        passwordMismatch ||
        isLoading

    return (
        <FormCard direction="column" gap="0.5rem">
            <Text
                sz="mdCt"
                color={themedPalette.text1}
                style={{ fontWeight: 'bold' }}
            >
                비밀번호 재설정
            </Text>
            <Text sz="smCt" color={themedPalette.text4} margin="0.25rem 0 0 0">
                <strong style={{ color: themedPalette.text2 }}>{email}</strong>{' '}
                로 코드를 전송했습니다.
            </Text>

            <Flex
                width="100%"
                direction="column"
                margin="2rem 0 2.5rem 0"
                gap="1.5rem"
            >
                <Flex direction="column" width="100%" gap="8px">
                    <Flex
                        width="100%"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Text sz="smCt" color={themedPalette.text4}>
                            인증 코드
                        </Text>
                        <ResendText
                            sz="smCt"
                            color={themedPalette.primary2}
                            onClick={onResend}
                            style={{
                                cursor: 'pointer',
                                opacity: isSending ? 0.5 : 1,
                            }}
                        >
                            {isSending ? '전송 중...' : '재전송'}
                        </ResendText>
                    </Flex>
                    <Input
                        type="text"
                        placeholder="이메일로 받은 코드를 입력해주세요"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                </Flex>

                <Input
                    label="새 비밀번호"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호를 입력해주세요"
                />

                <Flex
                    direction="column"
                    alignItems="flex-start"
                    width="100%"
                    gap="8px"
                >
                    <Input
                        label="비밀번호 확인"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="비밀번호를 다시 입력해주세요"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isDisabled)
                                onSubmit(token, newPassword)
                        }}
                    />
                    {passwordMismatch && (
                        <ErrorMessage>
                            비밀번호가 일치하지 않습니다.
                        </ErrorMessage>
                    )}
                </Flex>
            </Flex>

            <Button
                variant="primary"
                fullWidth
                disabled={isDisabled}
                onClick={() => onSubmit(token, newPassword)}
                type="button"
            >
                {isLoading ? '처리 중...' : '비밀번호 변경'}
            </Button>
        </FormCard>
    )
}

export default ResetPasswordForm

const FormCard = styled(Flex)`
    width: 100%;
    max-width: 420px;
    background-color: ${themedPalette.bg_element1};
    border-radius: 8px;
    padding: 40px 32px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

const ResendText = styled(Text)`
    text-decoration: underline;
    text-underline-offset: 2px;
    &:hover {
        opacity: 0.8;
    }
`

const ErrorMessage = styled.div`
    color: ${themedPalette.destructive1};
    font-size: 0.85rem;
`
