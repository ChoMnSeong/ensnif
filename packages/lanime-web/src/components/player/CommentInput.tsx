import styled from '@emotion/styled'
import Flex from '@components/common/Flex'
import Textarea from '@components/common/Textarea'
import Image from '@components/common/Image'
import Button from '@components/common/Button'

interface CommentInputProps {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    isLoading?: boolean
    avatarUrl?: string | null
}

const CommentInput: React.FC<CommentInputProps> = ({
    value,
    onChange,
    onSubmit,
    isLoading,
    avatarUrl,
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            onSubmit()
        }
    }

    return (
        <Flex gap="0.75rem" align="flex-start">
            {avatarUrl && (
                <AvatarWrap margin="2px 0 0 0">
                    <Image
                        src={avatarUrl}
                        alt="프로필"
                        width="40px"
                        height="40px"
                        borderRadius="50%"
                    />
                </AvatarWrap>
            )}
            <Flex flex={1} direction="column" gap="0.5rem">
                <Textarea
                    placeholder="댓글을 입력하세요... (Ctrl+Enter로 제출)"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    count={value.length}
                    maxCount={500}
                />
                <Flex justify="flex-end">
                    <Button
                        variant="primary"
                        size="sm"
                        disabled={!value.trim() || isLoading}
                        onClick={onSubmit}
                    >
                        댓글 작성
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default CommentInput

const AvatarWrap = styled(Flex)`
    flex-shrink: 0;
`

