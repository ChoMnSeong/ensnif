import { useState } from 'react'
import styled from '@emotion/styled'
import CommentInput from '@components/player/CommentInput'
import CommentList from '@components/player/CommentList'
import { Comment } from '@components/player/CommentListItem'

interface PlayerCommentContainerProps {
    initialComments?: Comment[]
}

const PlayerCommentContainer: React.FC<PlayerCommentContainerProps> = ({
    initialComments = [],
}) => {
    const [input, setInput] = useState('')
    const [comments, setComments] = useState(initialComments)

    const handleSubmit = () => {
        const trimmed = input.trim()
        if (!trimmed) return
        setComments((prev) => [
            { id: Date.now(), author: '나', content: trimmed, time: '방금 전' },
            ...prev,
        ])
        setInput('')
    }

    return (
        <Section>
            <CommentInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
            />
            <CommentList comments={comments} />
        </Section>
    )
}

export default PlayerCommentContainer

const Section = styled.section`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`
