import { useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Input from '@components/common/Input'
import Button from '@components/common/Button'

interface ResetPinFormProps {
    profileName: string
    onSubmit: (password: string) => void
    isLoading: boolean
}

const ResetPinForm: React.FC<ResetPinFormProps> = ({
    profileName,
    onSubmit,
    isLoading,
}) => {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')

    return (
        <FormCard direction="column" gap="0.5rem" padding="40px 32px">
            <BackButton as="button" align="center" gap="0.375rem" onClick={() => navigate('/profile')}>
                <MdArrowBack size={20} color={themedPalette.text2} />
                <Text sz="smCt" color={themedPalette.text2}>돌아가기</Text>
            </BackButton>

            <Text sz="mdCt" color={themedPalette.text1} margin="0.75rem 0 0 0">
                PIN 초기화
            </Text>
            <Text sz="smCt" color={themedPalette.text3} margin="0.25rem 0 0 0">
                <b>{profileName}</b> 프로필의 PIN을 초기화합니다.
            </Text>
            <Text sz="smCt" color={themedPalette.text3}>
                계정 비밀번호를 입력하면 PIN이 제거됩니다.
            </Text>

            <Flex width="100%" direction="column" margin="2rem 0 1rem 0">
                <Input
                    label="계정 비밀번호"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && password) onSubmit(password)
                    }}
                />
            </Flex>

            <Button
                variant="primary"
                fullWidth
                disabled={!password || isLoading}
                onClick={() => onSubmit(password)}
                type="button"
            >
                {isLoading ? '처리 중...' : 'PIN 초기화'}
            </Button>
        </FormCard>
    )
}

export default ResetPinForm

const FormCard = styled(Flex)`
    width: 100%;
    max-width: 420px;
    background-color: ${themedPalette.bg_element1};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

const BackButton = styled(Flex)`
    background: none;
    border: none;
    cursor: pointer;
    align-self: flex-start;
    opacity: 0.7;
    transition: opacity 0.15s ease;

    &:hover {
        opacity: 1;
    }
`
