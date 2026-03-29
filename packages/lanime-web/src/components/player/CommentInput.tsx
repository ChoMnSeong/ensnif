import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Textarea from '@components/common/Textarea'

interface CommentInputProps {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
}

const CommentInput: React.FC<CommentInputProps> = ({
    value,
    onChange,
    onSubmit,
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            onSubmit()
        }
    }

    return (
        <Row>
            <Avatar />
            <Wrapper>
                <Textarea
                    placeholder="댓글을 입력하세요... (Ctrl+Enter로 제출)"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    count={value.length}
                    maxCount={500}
                />
                <Footer>
                    <SubmitBtn onClick={onSubmit} disabled={!value.trim()}>
                        댓글 작성
                    </SubmitBtn>
                </Footer>
            </Wrapper>
        </Row>
    )
}

export default CommentInput

const Row = styled.div`
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
`

const Avatar = styled.div`
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${themedPalette.bg_element3};
    margin-top: 2px;
`

const Wrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
`

const SubmitBtn = styled.button`
    padding: 0.5rem 1.25rem;
    border-radius: 4px;
    border: none;
    background: ${themedPalette.primary1};
    color: #fff;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    &:not(:disabled):hover {
        opacity: 0.85;
    }
`
