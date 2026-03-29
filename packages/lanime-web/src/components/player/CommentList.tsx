import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import CommentListItem, { Comment } from '@components/player/CommentListItem'

interface CommentListProps {
    comments: Comment[]
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
    return (
        <Section>
            <Title>댓글 {comments.length}개</Title>
            <List>
                {comments.map((comment) => (
                    <CommentListItem key={comment.id} comment={comment} />
                ))}
            </List>
        </Section>
    )
}

export default CommentList

const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`

const Title = styled.h3`
    font-size: 1rem;
    font-weight: 700;
    color: ${themedPalette.text1};
    margin: 0;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid ${themedPalette.border2};
`

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`
