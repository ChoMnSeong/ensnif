import { useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Input from '@components/common/Input'
import Button from '@components/common/Button'

interface ForgotPasswordFormProps {
    onSubmit: (email: string) => void
    isLoading: boolean
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    onSubmit,
    isLoading,
}) => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    return (
        <FormCard direction="column" gap="0.5rem">
            <BackButton onClick={() => navigate('/auth/mail')}>
                <MdArrowBack size={20} color={themedPalette.text2} />
                <Text sz="smCt" color={themedPalette.text2}>돌아가기</Text>
            </BackButton>
            <Text sz="mdCt" color={themedPalette.text1} margin="0.75rem 0 0 0">
                비밀번호 찾기
            </Text>
            <Text sz="smCt" color={themedPalette.text3} margin="0.5rem 0 0 0">
                가입한 이메일을 입력하면 재설정 코드를 보내드립니다.
            </Text>

            <Flex width="100%" direction="column" margin="2rem 0 1rem 0" gap="1.5rem">
                <Input
                    label="이메일"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력해주세요"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && isEmailValid) onSubmit(email)
                    }}
                />
            </Flex>

            <Button
                variant="primary"
                fullWidth
                disabled={!isEmailValid || isLoading}
                onClick={() => onSubmit(email)}
                type="button"
            >
                {isLoading ? '전송 중...' : '재설정 코드 전송'}
            </Button>
        </FormCard>
    )
}

export default ForgotPasswordForm

const FormCard = styled(Flex)`
    width: 100%;
    max-width: 420px;
    background-color: ${themedPalette.bg_element1};
    border-radius: 8px;
    padding: 40px 32px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

const BackButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.375rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    align-self: flex-start;
    opacity: 0.7;
    transition: opacity 0.15s ease;

    &:hover {
        opacity: 1;
    }
`
