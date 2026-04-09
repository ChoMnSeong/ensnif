import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import { Review } from '@libs/apis/animations/type'
import { validImageURL } from '@libs/validImageURL'
import Flex from '@components/common/Flex'
import Image from '@components/common/Image'
import Icon from '@components/common/Icon'
import Button from '@components/common/Button'
import Textarea from '@components/common/Textarea'
import AnimationStarSelector from '@components/home/AnimationStarSelector'
import { useTranslation } from 'react-i18next'

interface AnimationReviewCardProps {
    review: Review
    isOwn: boolean
    onDelete: () => void
    onUpdate: (rating: number, comment: string) => void
    isUpdating: boolean
}

const MAX_COMMENT = 500

const AnimationReviewCard: React.FC<AnimationReviewCardProps> = ({
    review,
    isOwn,
    onDelete,
    onUpdate,
    isUpdating,
}) => {
    const { t } = useTranslation()
    const [isEditing, setIsEditing] = useState(false)
    const [editRating, setEditRating] = useState(0)
    const [editHoverRating, setEditHoverRating] = useState(0)
    const [editComment, setEditComment] = useState('')
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false)
            }
        }
        if (menuOpen) document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [menuOpen])

    const handleEditStart = () => {
        setIsEditing(true)
        setEditRating(review.rating)
        setEditComment(review.comment)
        setEditHoverRating(0)
        setMenuOpen(false)
    }

    const handleEditCancel = () => {
        setIsEditing(false)
        setEditRating(0)
        setEditComment('')
        setEditHoverRating(0)
    }

    const handleEditSubmit = () => {
        if (editRating === 0 || isUpdating) return
        onUpdate(editRating, editComment)
        setIsEditing(false)
    }

    const avatarSrc = validImageURL(review.avatarURL)
        ? review.avatarURL
        : 'https://st3.depositphotos.com/7486768/17949/v/450/depositphotos_179490486-stock-illustration-profile-anonymous-face-icon-gray.jpg'

    const formattedDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })

    return (
        <ReviewCard as="li" direction="column" width="100%" padding="0 0 1rem 0">
            <Flex justify="space-between" align="center" margin="0 0 0.5rem 0">
                <Flex align="center" gap="0.4rem">
                    {!isEditing && (
                        <>
                            <Star percentage={(review.rating / 5) * 100}>
                                {Array.from({ length: 5 }).map(() => '★')}
                            </Star>
                            <RatingScore>{review.rating.toFixed(1)}</RatingScore>
                        </>
                    )}
                    <TimeText margin="0 0 0 0.5rem">
                        {review.updateAt && review.updateAt !== review.createdAt ? (
                            <Flex align="center" gap="0.3rem">
                                <UpdatedBadge>{t('review.updated')}</UpdatedBadge>
                                {formattedDate(review.updateAt)}
                            </Flex>
                        ) : (
                            formattedDate(review.createdAt)
                        )}
                    </TimeText>
                </Flex>

                <Flex align="center" gap="0.5rem">
                    <Flex align="center" gap="0.5rem">
                        <Image src={avatarSrc} alt={review.profileName} width="30px" height="30px" borderRadius="50%" />
                        <Nickname>{review.profileName || t('review.anonymous')}</Nickname>
                    </Flex>
                    {isOwn && (
                        <MenuWrap ref={menuRef}>
                            <MenuTrigger
                                as="button"
                                align="center"
                                justify="center"
                                padding="4px"
                                onClick={() => setMenuOpen((v) => !v)}
                            >
                                <Icon name="moreVert" size={20} color={themedPalette.text4} />
                            </MenuTrigger>
                            {menuOpen && (
                                <MenuDropdown direction="column">
                                    <MenuItem as="button" width="100%" padding="0.6rem 1rem" onClick={handleEditStart}>
                                        {t('common.edit')}
                                    </MenuItem>
                                    <MenuItem
                                        as="button"
                                        width="100%"
                                        padding="0.6rem 1rem"
                                        danger
                                        onClick={() => {
                                            onDelete()
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
            </Flex>

            {isEditing ? (
                <Flex direction="column" gap="0.5rem" margin="0.5rem 0 0 0">
                    <AnimationStarSelector
                        rating={editRating}
                        hoverRating={editHoverRating}
                        onRatingChange={setEditRating}
                        onHoverChange={setEditHoverRating}
                    />
                    <Textarea
                        placeholder={t('review.placeholder')}
                        rows={3}
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value.slice(0, MAX_COMMENT))}
                        count={editComment.length}
                        maxCount={MAX_COMMENT}
                    />
                    <Flex justify="flex-end" gap="0.5rem">
                        <Button variant="secondary" size="sm" onClick={handleEditCancel}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            disabled={editRating === 0 || isUpdating}
                            onClick={handleEditSubmit}
                        >
                            {isUpdating ? t('review.editing') : t('review.editDone')}
                        </Button>
                    </Flex>
                </Flex>
            ) : (
                <Comment as="p" margin="0.4rem 0" width="100%">
                    {review.comment}
                </Comment>
            )}
        </ReviewCard>
    )
}

export default AnimationReviewCard

const ReviewCard = styled(Flex)`
    border-bottom: 1px solid ${themedPalette.border2};
`

const Star = styled.span<{ percentage: number }>`
    display: inline-block;
    background: linear-gradient(
        90deg,
        ${themedPalette.primary1} ${({ percentage }) => percentage}%,
        ${themedPalette.gray3} ${({ percentage }) => percentage}%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: background 0.3s ease;
    font-size: 1.1rem;
`

const RatingScore = styled.span`
    font-weight: 600;
    color: ${themedPalette.text1};
`

const TimeText = styled(Flex)`
    color: ${themedPalette.text3};
    font-size: 0.85rem;
`

const UpdatedBadge = styled.span`
    font-size: 0.75rem;
    color: ${themedPalette.text3};
    white-space: nowrap;
`

const Nickname = styled.span`
    font-size: 0.9rem;
    color: ${themedPalette.text2};
`

const Comment = styled(Flex)`
    font-size: 0.95rem;
    color: ${themedPalette.text1};
    white-space: pre-wrap;
    line-height: 1.5;
    text-align: left;
`

const MenuWrap = styled.div`
    position: relative;
`

const MenuTrigger = styled(Flex)`
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    &:hover { background: ${themedPalette.bg_element3}; }
`

const MenuDropdown = styled(Flex)`
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

const MenuItem = styled(Flex)<{ danger?: boolean }>`
    background: none;
    border: none;
    text-align: left;
    font-size: 0.85rem;
    font-weight: 500;
    color: ${({ danger }) => (danger ? themedPalette.destructive1 : themedPalette.text1)};
    cursor: pointer;
    &:hover { background: ${themedPalette.bg_element3}; }
`
