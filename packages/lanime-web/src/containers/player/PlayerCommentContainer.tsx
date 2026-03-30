import { useState } from 'react'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { RootState } from '@stores/index'
import CommentInput from '@components/player/CommentInput'
import CommentWithReplies from '@components/player/CommentWithReplies'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import {
    useCommentsQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} from '@libs/apis/comments'

interface PlayerCommentContainerProps {
    episodeId: string
}

const PlayerCommentContainer: React.FC<PlayerCommentContainerProps> = ({
    episodeId,
}) => {
    const profile = useSelector((state: RootState) => state.userProfile)
    const [input, setInput] = useState('')

    const {
        data: commentsData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useCommentsQuery(episodeId)

    const comments = commentsData?.pages.flatMap((p) => p.data.comments) ?? []
    const totalCount = commentsData?.pages[0]?.data.totalCount ?? 0

    const createMutation = useCreateCommentMutation(episodeId)
    const updateMutation = useUpdateCommentMutation(episodeId)
    const deleteMutation = useDeleteCommentMutation(episodeId)

    const handleSubmit = () => {
        const trimmed = input.trim()
        if (!trimmed) return
        createMutation.mutate({ content: trimmed })
        setInput('')
    }

    const handleReply = (parentCommentId: string, content: string) => {
        createMutation.mutate({ content, parentCommentId })
    }

    const handleUpdate = (commentId: string, content: string) => {
        updateMutation.mutate({ commentId, body: { content } })
    }

    const handleDelete = (commentId: string) => {
        deleteMutation.mutate(commentId)
    }

    return (
        <Flex as="section" direction="column" gap="1.5rem">
            <CommentInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                isLoading={createMutation.isPending}
                avatarUrl={profile.avatarUrl}
            />

            <Flex direction="column" gap="1.25rem">
                <CommentTitle>댓글 {totalCount}개</CommentTitle>
                <Flex direction="column" gap="1.5rem">
                    {comments.map((comment) => (
                        <CommentWithReplies
                            key={comment.commentId}
                            comment={comment}
                            episodeId={episodeId}
                            currentProfileId={profile.profileId}
                            currentAvatarUrl={profile.avatarUrl}
                            currentNickname={profile.nickname}
                            onReply={handleReply}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    ))}
                </Flex>
                {hasNextPage && (
                    <LoadMoreBtn
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage ? '불러오는 중...' : '댓글 더 보기'}
                    </LoadMoreBtn>
                )}
            </Flex>
        </Flex>
    )
}

export default PlayerCommentContainer

const CommentTitle = styled.h3`
    font-size: 1rem;
    font-weight: 700;
    color: ${themedPalette.text1};
    margin: 0;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid ${themedPalette.border2};
`

const LoadMoreBtn = styled.button`
    align-self: center;
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
    border: 1px solid ${themedPalette.border2};
    background: none;
    color: ${themedPalette.text3};
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    &:hover {
        background: ${themedPalette.bg_element2};
    }
    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`
