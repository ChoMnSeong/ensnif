import React, { ChangeEvent } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import Text from '@components/common/Text'
import Flex from '@components/common/Flex'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import { themedPalette } from '@libs/style/theme'

interface MailFormProps {
    mail: string
    password?: string
    isRegistered: boolean
    error: string
    isButtonDisabled: boolean
    onMailChange: (e: ChangeEvent<HTMLInputElement>) => void
    onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void
    onSubmit: () => void
    isLoading: boolean
}

const MailForm: React.FC<MailFormProps> = ({
    mail,
    password,
    isRegistered,
    error,
    isButtonDisabled,
    onMailChange,
    onPasswordChange,
    onSubmit,
    isLoading,
}) => {
    const navigate = useNavigate()

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') onSubmit()
    }

    return (
        <FormCard direction="column" gap="0.5rem" padding="40px 32px">
            <Text sz="mdCt" color={themedPalette.text1}>
                이메일로 시작
            </Text>

            <Flex
                width="100%"
                direction="column"
                margin="2rem 0 1rem 0"
                gap="1.5rem"
            >
                <Input
                    label="이메일"
                    type="email"
                    value={mail}
                    onChange={onMailChange}
                    placeholder="이메일을 입력해주세요"
                />

                {isRegistered && (
                    <Input
                        label="비밀번호"
                        type="password"
                        value={password || ''}
                        onChange={onPasswordChange}
                        onKeyDown={handleKeyDown}
                        placeholder="비밀번호를 입력해주세요"
                    />
                )}

                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Flex>

            <Button
                variant="text"
                size="sm"
                type="button"
                onClick={() => navigate('/auth/forgot-password')}
                style={{ opacity: 0.7, padding: 0 }}
            >
                비밀번호를 잊으셨나요?
            </Button>

            <Button
                variant="primary"
                fullWidth
                disabled={isButtonDisabled}
                onClick={onSubmit}
                type="button"
                style={{ marginTop: '1rem' }}
            >
                {isLoading ? '처리 중...' : '다음'}
            </Button>
        </FormCard>
    )
}

export default MailForm

const FormCard = styled(Flex)`
    width: 100%;
    max-width: 420px;
    background-color: ${themedPalette.bg_element1};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

const ErrorMessage = styled.div`
    color: ${themedPalette.destructive1};
    font-size: 0.85rem;
    text-align: left;
    width: 100%;
`
