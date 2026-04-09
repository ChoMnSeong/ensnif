import { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { themedPalette } from '@libs/style/theme'
import { IComment } from '@libs/apis/comments/type'
import Flex from '@components/common/Flex'
import Textarea from '@components/common/Textarea'
import Image from '@components/common/Image'
import Icon from '@components/common/Icon'
import Button from '@components/common/Button'
import { useTranslation } from 'react-i18next'

const formatDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

interface CommentListItemProps {
    comment: IComment
    currentProfileId: string | null
    currentAvatarUrl?: string | null
    currentNickname?: string | null
    isReply?: boolean
    onReply?: (parentCommentId: string, content: string) => void
    onUpdate?: (commentId: string, content: string) => void
    onDelete?: (commentId: string) => void
    replies?: IComment[]
    hasMoreReplies?: boolean
    onLoadReplies?: () => void
    isLoadingReplies?: boolean
    repliesLoading?: boolean
    showReplies?: boolean
    onToggleReplies?: () => void
}

const CommentListItem: React.FC<CommentListItemProps> = ({
    comment,
    currentProfileId,
    currentAvatarUrl,
    currentNickname,
    isReply = false,
    onReply,
    onUpdate,
    onDelete,
    replies,
    hasMoreReplies,
    onLoadReplies,
    isLoadingReplies,
    repliesLoading,
    showReplies,
    onToggleReplies,
}) => {
    const { t } = useTranslation()
    const [showReplyInput, setShowReplyInput] = useState(false)
    const [replyValue, setReplyValue] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(comment.content)
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const isOwner = currentProfileId === comment.profileId

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false)
            }
        }
        if (menuOpen) document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [menuOpen])

    const handleReplySubmit = () => {
        const trimmed = replyValue.trim()
        if (!trimmed || !onReply) return
        onReply(comment.commentId, trimmed)
        setReplyValue('')
        setShowReplyInput(false)
    }

    const handleEditSubmit = () => {
        const trimmed = editValue.trim()
        if (!trimmed || !onUpdate) return
        onUpdate(comment.commentId, trimmed)
        setIsEditing(false)
    }

    const avatarSize = isReply ? 32 : 40

    return (
        <Flex direction="column" gap="0.5rem">
            <Flex gap="0.75rem" align="flex-start">
                <Image
                    src={comment.avatarUrl!}
                    alt={comment.profileName}
                    width={`${avatarSize}px`}
                    height={`${avatarSize}px`}
                    borderRadius="50%"
                />
                <Flex flex={1} direction="column" gap="0.3rem" style={{ minWidth: 0 }}>
                    <Flex align="center" gap="0.5rem">
                        <AuthorName>{comment.profileName}</AuthorName>
                        <TimeText>{formatDate(comment.createdAt)}</TimeText>
                    </Flex>

                    {isEditing ? (
                        <Flex direction="column" gap="0.5rem">
                            <Textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                rows={2}
                                count={editValue.length}
                                maxCount={500}
                            />
                            <Flex justify="flex-end" gap="0.5rem">
                                <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    disabled={!editValue.trim()}
                                    onClick={handleEditSubmit}
                                >
                                    {t('common.save')}
                                </Button>
                            </Flex>
                        </Flex>
                    ) : (
                        <ContentText>{comment.content}</ContentText>
                    )}

                    <Flex align="center" margin="0.1rem 0 0 0">
                        {!isReply && (
                            <Button variant="text" size="sm" onClick={() => setShowReplyInput((v) => !v)}>
                                {t('comment.reply')}
                            </Button>
                        )}
                    </Flex>

                    {!isReply && comment.replyCount > 0 && (
                        <Button variant="text" size="sm" onClick={onToggleReplies}>
                            <Icon
                                name={showReplies ? 'expandLess' : 'expandMore'}
                                size={18}
                                color={themedPalette.primary1}
                            />
                            {showReplies
                                ? t('comment.hideReplies')
                                : t('comment.replyCount', { count: comment.replyCount })}
                        </Button>
                    )}
                </Flex>

                {isOwner && (
                    <MenuWrap ref={menuRef}>
                        <MenuTrigger onClick={() => setMenuOpen((v) => !v)}>
                            <Icon name="moreVert" size={20} color={themedPalette.text4} />
                        </MenuTrigger>
                        {menuOpen && (
                            <MenuDropdown>
                                <MenuItem
                                    onClick={() => {
                                        setIsEditing(true)
                                        setEditValue(comment.content)
                                        setMenuOpen(false)
                                    }}
                                >
                                    {t('common.edit')}
                                </MenuItem>
                                <MenuItem
                                    danger
                                    onClick={() => {
                                        onDelete?.(comment.commentId)
                                        setMenuOpen(false)
                                    }}
                                >
                                    {t('common.delete')}
                                </MenuItem>
                            </MenuDropdown>
                        )}
                    </MenuWrap>
                )}
            </Flex>

            {showReplyInput && (
                <Flex gap="0.75rem" align="flex-start" padding={`0 0 0 ${avatarSize + 12}px`}>
                    {currentAvatarUrl && (
                        <Image
                            src={currentAvatarUrl}
                            alt={currentNickname ?? ''}
                            width="32px"
                            height="32px"
                            borderRadius="50%"
                        />
                    )}
                    <Flex flex={1} direction="column" gap="0.5rem">
                        <Textarea
                            placeholder={t('comment.replyPlaceholder')}
                            value={replyValue}
                            onChange={(e) => setReplyValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleReplySubmit()
                            }}
                            rows={2}
                            count={replyValue.length}
                            maxCount={500}
                        />
                        <Flex justify="flex-end" gap="0.5rem">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    setShowReplyInput(false)
                                    setReplyValue('')
                                }}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                disabled={!replyValue.trim()}
                                onClick={handleReplySubmit}
                            >
                                {t('comment.submitReply')}
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            )}

            {!isReply && showReplies && (
                <Flex direction="column" gap="1rem" padding="0 0 0 52px">
                    {repliesLoading && <LoadingText>{t('comment.loadingReplies')}</LoadingText>}
                    {replies?.map((reply) => (
                        <CommentListItem
                            key={reply.commentId}
                            comment={reply}
                            currentProfileId={currentProfileId}
                            currentAvatarUrl={currentAvatarUrl}
                            currentNickname={currentNickname}
                            isReply
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                    {hasMoreReplies && (
                        <Button
                            variant="text"
                            size="sm"
                            disabled={isLoadingReplies}
                            onClick={onLoadReplies}
                        >
                            {isLoadingReplies ? t('common.loading') : t('comment.loadMore')}
                        </Button>
                    )}
                </Flex>
            )}
        </Flex>
    )
}

export default CommentListItem

const AuthorName = styled.span`
    font-size: 0.85rem;
    font-weight: 600;
    color: ${themedPalette.text1};
`

const TimeText = styled.span`
    font-size: 0.78rem;
    color: ${themedPalette.text4};
`

const ContentText = styled.p`
    font-size: 0.9rem;
    color: ${themedPalette.text1};
    line-height: 1.6;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
`

const iconBtnBase = css`
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border-radius: 50%;
    transition: background 0.15s;
    &:hover { background: ${themedPalette.bg_element3}; }
`

const MenuWrap = styled.div`
    position: relative;
    flex-shrink: 0;
`

const MenuTrigger = styled.button`
    ${iconBtnBase}
`

const MenuDropdown = styled.div`
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    background: ${themedPalette.bg_element1};
    border: 1px solid ${themedPalette.border2};
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    z-index: 100;
    min-width: 100px;
`

const MenuItem = styled.button<{ danger?: boolean }>`
    display: block;
    width: 100%;
    padding: 0.6rem 1rem;
    background: none;
    border: none;
    text-align: left;
    font-size: 0.85rem;
    font-weight: 500;
    color: ${({ danger }) => (danger ? themedPalette.destructive1 : themedPalette.text1)};
    cursor: pointer;
    &:hover { background: ${themedPalette.bg_element3}; }
`

const LoadingText = styled.p`
    font-size: 0.78rem;
    color: ${themedPalette.text4};
    margin: 0;
`
