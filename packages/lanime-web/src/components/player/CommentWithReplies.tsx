import { useState } from 'react'
import { useRepliesQuery } from '@libs/apis/comments'
import { IComment } from '@libs/apis/comments/type'
import CommentListItem from './CommentListItem'

interface CommentWithRepliesProps {
    comment: IComment
    episodeId: string
    currentProfileId: string | null
    currentAvatarUrl: string | null
    currentNickname?: string | null
    onReply: (parentCommentId: string, content: string) => void
    onUpdate: (commentId: string, content: string) => void
    onDelete: (commentId: string) => void
}

const CommentWithReplies: React.FC<CommentWithRepliesProps> = ({
    comment,
    episodeId,
    currentProfileId,
    currentAvatarUrl,
    currentNickname,
    onReply,
    onUpdate,
    onDelete,
}) => {
    const [showReplies, setShowReplies] = useState(false)
    const [repliesEnabled, setRepliesEnabled] = useState(false)

    const {
        data: repliesData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isFetching,
    } = useRepliesQuery(episodeId, comment.commentId, repliesEnabled)

    const replies = repliesData?.pages.flatMap((p) => p.data.comments)

    const handleToggleReplies = () => {
        if (!showReplies && !repliesEnabled) {
            setRepliesEnabled(true)
        }
        setShowReplies((v) => !v)
    }

    return (
        <CommentListItem
            comment={comment}
            currentProfileId={currentProfileId}
            currentAvatarUrl={currentAvatarUrl}
            currentNickname={currentNickname}
            onReply={onReply}
            onUpdate={onUpdate}
            onDelete={onDelete}
            replies={replies}
            hasMoreReplies={hasNextPage ?? false}
            onLoadReplies={() => fetchNextPage()}
            isLoadingReplies={isFetchingNextPage}
            repliesLoading={repliesEnabled && isFetching && !repliesData}
            showReplies={showReplies}
            onToggleReplies={handleToggleReplies}
        />
    )
}

export default CommentWithReplies
