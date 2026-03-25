import React, { ChangeEvent } from 'react'
import styled from '@emotion/styled'
import Text from '../common/Text'
import Flex from '../common/Flex'
import Button from '../common/Button'
import Input from '../common/Input'
import { themedPalette } from '../../libs/style/theme'

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
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') onSubmit()
    }

    return (
        <FormCard direction="column" gap="0.5rem">
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

            <Text
                sz="smCt"
                color={themedPalette.text4}
                hoverColor={themedPalette.text3}
                style={{ cursor: 'pointer' }}
            >
                로그인에 어려움을 겪고 계신가요?
            </Text>

            <StyledSubmitButton
                disabled={isButtonDisabled}
                onClick={onSubmit}
                type="button"
            >
                {isLoading ? '처리 중...' : '다음'}
            </StyledSubmitButton>
        </FormCard>
    )
}

export default MailForm

const FormCard = styled(Flex)`
    width: 100%;
    max-width: 420px;
    background-color: ${themedPalette.bg_element1};
    border-radius: 8px;
    padding: 40px 32px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

const ErrorMessage = styled.div`
    color: ${themedPalette.destructive1};
    font-size: 0.85rem;
    text-align: left;
    width: 100%;
`

const StyledSubmitButton = styled(Button)`
    width: 100%;
    padding: 14px 0;
    margin-top: 1rem;
    background-color: ${({ disabled }) =>
        disabled ? themedPalette.bg_element3 : themedPalette.primary1};
    color: ${({ disabled }) =>
        disabled ? themedPalette.text4 : themedPalette.white};
`
