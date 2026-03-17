import React, { ChangeEvent, KeyboardEventHandler } from 'react'
import styled from '@emotion/styled'
import Text from '../common/Text'
import Flex from '../common/Flex'
import { themedPalette } from '../../libs/style/theme'
import Button from '../common/Button'

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
    const handleKeyDown = (event: { key: string }) => {
        if (event.key === 'Enter') {
            onSubmit()
        }
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
                <InputGroup
                    label="이메일"
                    type="email"
                    value={mail || ''}
                    onChange={onMailChange}
                    placeholder="이메일을 입력해주세요"
                />

                {isRegistered && (
                    <InputGroup
                        label="비밀번호"
                        type="password"
                        value={password || ''}
                        onChange={onPasswordChange}
                        placeholder="비밀번호를 입력해주세요"
                        onKeyDown={handleKeyDown}
                    />
                )}

                {error && (
                    <Text sz="smCt" color={themedPalette.destructive1}>
                        {error}
                    </Text>
                )}
            </Flex>

            <Text
                sz="smCt"
                color={themedPalette.text4}
                hoverColor={themedPalette.text3}
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

// 내부 헬퍼 컴포넌트
const InputGroup = ({
    label,
    ...props
}: {
    label: string
    type: string
    value?: string | number
    onChange: (e: ChangeEvent<HTMLInputElement, Element>) => void
    placeholder?: string
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>
}) => (
    <Flex width="100%" direction="column" gap="0.5rem" alignItems="start">
        <Text sz="smCt" color={themedPalette.text2}>
            {label}
        </Text>
        <StyledInput
            type={props.type}
            value={props?.value}
            placeholder={props.placeholder}
            onChange={props.onChange}
            onKeyDown={props.onKeyDown}
        />
    </Flex>
)

export default MailForm

const FormCard = styled(Flex)`
    width: 100%;
    max-width: 420px;
    background-color: ${themedPalette.bg_element1};
    border-radius: 8px;
    padding: 40px 32px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

const StyledInput = styled.input`
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid ${themedPalette.border2};
    color: ${themedPalette.text1};
    font-size: 1rem;
    padding: 8px 0;
    outline: none;
    transition: border-bottom-color 0.2s ease-in-out;

    &::placeholder {
        color: ${themedPalette.text4};
    }

    &:focus {
        border-bottom: 1px solid ${themedPalette.primary1};
    }
`

const StyledSubmitButton = styled(Button)`
    padding: 14px 0;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 4px;

    /* 상태에 따른 배경색/글자색 로직만 여기에 집중 */
    background-color: ${({ disabled }) =>
        disabled ? themedPalette.bg_element3 : themedPalette.primary1};
    color: ${({ disabled }) =>
        disabled ? themedPalette.text4 : themedPalette.text1};

    &:hover {
        background-color: ${({ disabled }) =>
            disabled ? themedPalette.bg_element3 : themedPalette.primary2};
    }
`
