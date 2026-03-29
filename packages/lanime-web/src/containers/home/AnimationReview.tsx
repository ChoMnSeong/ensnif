import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { useInfiniteAnimationReview, useCreateAnimationReview, useUpdateAnimationReview } from '@libs/apis/animations'
import { themedPalette } from '@libs/style/theme'
import AnimationReviewGraph from '@components/home/AnimationReviewGraph'
import AnimationAverageRating from '@components/home/AnimationAverageRating'
import { validImageURL } from '@libs/validImageURL'
import Textarea from '@components/common/Textarea'
import Button from '@components/common/Button'
import { RootState } from '@stores/index'

export interface RatingCount {
    rating: number
    count: number
}

interface AnimationReviewProps {
    animationId: string
    scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

const MAX_COMMENT = 500

const AnimationReview: React.FC<AnimationReviewProps> = ({
    animationId,
    scrollContainerRef,
}) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteAnimationReview(animationId)
    const { mutate: createReview, isPending } = useCreateAnimationReview(animationId)
    const { mutate: updateReview, isPending: isUpdating } = useUpdateAnimationReview(animationId)

    const currentProfileId = useSelector((state: RootState) => state.userProfile.profileId)

    const [hoverRating, setHoverRating] = useState(0)
    const [selectedRating, setSelectedRating] = useState(0)
    const [comment, setComment] = useState('')

    const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
    const [editHoverRating, setEditHoverRating] = useState(0)
    const [editRating, setEditRating] = useState(0)
    const [editComment, setEditComment] = useState('')

    const allReviews =
        data?.pages.flatMap((page) => page.data.data.reviews) ?? []

    const firstPageData = data?.pages[0]?.data.data
    const averageRating = firstPageData?.averageRating ?? 0
    const totalCount = firstPageData?.totalCount ?? 0
    const ratingCounts: RatingCount[] = firstPageData?.ratingCounts ?? []

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current
        if (!scrollContainer) return

        const handleScroll = () => {
            const isBottom =
                scrollContainer.scrollTop + scrollContainer.clientHeight >=
                scrollContainer.scrollHeight - 10

            if (isBottom && hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
            }
        }

        scrollContainer.addEventListener('scroll', handleScroll)
        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll)
        }
    }, [scrollContainerRef, hasNextPage, isFetchingNextPage, fetchNextPage])

    const handleSubmit = () => {
        if (selectedRating === 0 || isPending) return
        createReview(
            { rating: selectedRating, comment },
            {
                onSuccess: () => {
                    setSelectedRating(0)
                    setComment('')
                },
            },
        )
    }

    const handleEditStart = (review: { reviewId: string; rating: number; comment: string }) => {
        setEditingReviewId(review.reviewId)
        setEditRating(review.rating)
        setEditComment(review.comment)
        setEditHoverRating(0)
    }

    const handleEditCancel = () => {
        setEditingReviewId(null)
        setEditRating(0)
        setEditComment('')
        setEditHoverRating(0)
    }

    const handleEditSubmit = () => {
        if (!editingReviewId || editRating === 0 || isUpdating) return
        updateReview(
            { rating: editRating, comment: editComment },
            {
                onSuccess: () => {
                    handleEditCancel()
                },
            },
        )
    }

    return (
        <Container>
            <SectionTitle>평균 평점</SectionTitle>
            <ReviewSummaryContainer>
                <AnimationAverageRating
                    averageRating={averageRating}
                    total={totalCount}
                />
                <AnimationReviewGraph ratingCounts={ratingCounts} />
            </ReviewSummaryContainer>

            <WriteSection>
                <SectionTitle>리뷰 작성</SectionTitle>
                <StarSelector>
                    {[1, 2, 3, 4, 5].map((star) => {
                        const display = hoverRating || selectedRating
                        const fill =
                            display >= star
                                ? 'full'
                                : display >= star - 0.5
                                  ? 'half'
                                  : 'empty'
                        return (
                            <StarButton
                                key={star}
                                fill={fill}
                                onMouseMove={(e) => {
                                    const rect =
                                        e.currentTarget.getBoundingClientRect()
                                    const isLeft =
                                        e.clientX - rect.left < rect.width / 2
                                    setHoverRating(isLeft ? star - 0.5 : star)
                                }}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() =>
                                    setSelectedRating(hoverRating || star)
                                }
                                type="button"
                                aria-label={`${star}점`}
                            >
                                ★
                            </StarButton>
                        )
                    })}
                    <RatingLabel>
                        {(hoverRating || selectedRating) > 0
                            ? `${hoverRating || selectedRating}점`
                            : '별점을 선택하세요'}
                    </RatingLabel>
                </StarSelector>
                <Textarea
                    placeholder="이 작품에 대한 리뷰를 남겨주세요."
                    rows={4}
                    value={comment}
                    onChange={(e) =>
                        setComment(e.target.value.slice(0, MAX_COMMENT))
                    }
                    count={comment.length}
                    maxCount={MAX_COMMENT}
                />
                <SubmitRow>
                    <Button
                        variant="primary"
                        size="sm"
                        disabled={selectedRating === 0 || isPending}
                        onClick={handleSubmit}
                    >
                        {isPending ? '등록 중...' : '리뷰 등록'}
                    </Button>
                </SubmitRow>
            </WriteSection>

            <ReviewList>
                {allReviews.map((review) => {
                    const isOwn = currentProfileId === review.profileId
                    const isEditing = editingReviewId === review.reviewId

                    return (
                        <ReviewCard key={review.reviewId}>
                            <Header>
                                <LeftInfo>
                                    {!isEditing && (
                                        <>
                                            <Star percentage={(review.rating / 5) * 100}>
                                                {Array.from({ length: 5 }).map(() => '★')}
                                            </Star>
                                            <RatingScore>
                                                {review.rating.toFixed(1)}
                                            </RatingScore>
                                        </>
                                    )}
                                    <TimeText>
                                        {review.updateAt && review.updateAt !== review.createdAt ? (
                                            <>
                                                <UpdatedBadge>수정됨</UpdatedBadge>
                                                {new Date(review.updateAt).toLocaleDateString('ko-KR', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </>
                                        ) : (
                                            new Date(review.createdAt).toLocaleDateString('ko-KR', {
                                                month: 'short',
                                                day: 'numeric',
                                            })
                                        )}
                                    </TimeText>
                                </LeftInfo>
                                <UserInfo>
                                    <Avatar
                                        src={
                                            validImageURL(review.avatarURL)
                                                ? review.avatarURL
                                                : 'https://st3.depositphotos.com/7486768/17949/v/450/depositphotos_179490486-stock-illustration-profile-anonymous-face-icon-gray.jpg'
                                        }
                                    />
                                    <Nickname>
                                        {review.profileName || '익명'}
                                    </Nickname>
                                </UserInfo>
                            </Header>

                            {isEditing ? (
                                <EditSection>
                                    <StarSelector>
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const display = editHoverRating || editRating
                                            const fill =
                                                display >= star
                                                    ? 'full'
                                                    : display >= star - 0.5
                                                      ? 'half'
                                                      : 'empty'
                                            return (
                                                <StarButton
                                                    key={star}
                                                    fill={fill}
                                                    onMouseMove={(e) => {
                                                        const rect = e.currentTarget.getBoundingClientRect()
                                                        const isLeft = e.clientX - rect.left < rect.width / 2
                                                        setEditHoverRating(isLeft ? star - 0.5 : star)
                                                    }}
                                                    onMouseLeave={() => setEditHoverRating(0)}
                                                    onClick={() => setEditRating(editHoverRating || star)}
                                                    type="button"
                                                    aria-label={`${star}점`}
                                                >
                                                    ★
                                                </StarButton>
                                            )
                                        })}
                                        <RatingLabel>
                                            {(editHoverRating || editRating) > 0
                                                ? `${editHoverRating || editRating}점`
                                                : '별점을 선택하세요'}
                                        </RatingLabel>
                                    </StarSelector>
                                    <Textarea
                                        placeholder="이 작품에 대한 리뷰를 남겨주세요."
                                        rows={3}
                                        value={editComment}
                                        onChange={(e) =>
                                            setEditComment(e.target.value.slice(0, MAX_COMMENT))
                                        }
                                        count={editComment.length}
                                        maxCount={MAX_COMMENT}
                                    />
                                    <EditButtonRow>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleEditCancel}
                                        >
                                            취소
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            disabled={editRating === 0 || isUpdating}
                                            onClick={handleEditSubmit}
                                        >
                                            {isUpdating ? '수정 중...' : '수정 완료'}
                                        </Button>
                                    </EditButtonRow>
                                </EditSection>
                            ) : (
                                <>
                                    <Comment>{review.comment}</Comment>
                                    {isOwn && (
                                        <EditButtonRow>
                                            <EditButton
                                                type="button"
                                                onClick={() => handleEditStart(review)}
                                            >
                                                수정
                                            </EditButton>
                                        </EditButtonRow>
                                    )}
                                </>
                            )}
                        </ReviewCard>
                    )
                })}
            </ReviewList>
        </Container>
    )
}

export default AnimationReview

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
`

const ReviewSummaryContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 3rem;
    margin-bottom: 1.5rem;

    @media (max-width: 480px) {
        justify-content: center;
        gap: 1.5rem;
    }
`

const WriteSection = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-top: 1.25rem;
    margin-bottom: 1.5rem;
    border-top: 1px solid ${themedPalette.border2};
`

const SectionTitle = styled.span`
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    color: ${themedPalette.text2};
    text-align: left;
    margin-bottom: 0.25rem;
`

const StarSelector = styled.div`
    display: flex;
    align-items: center;
    gap: 0.15rem;
`

const StarButton = styled.button<{ fill: 'full' | 'half' | 'empty' }>`
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 1.6rem;
    line-height: 1;
    transition: transform 0.1s;
    background: ${({ fill }) =>
        fill === 'full'
            ? `linear-gradient(90deg, ${themedPalette.primary1} 100%, ${themedPalette.gray3} 100%)`
            : fill === 'half'
              ? `linear-gradient(90deg, ${themedPalette.primary1} 50%, ${themedPalette.gray3} 50%)`
              : `linear-gradient(90deg, ${themedPalette.gray3} 100%, ${themedPalette.gray3} 100%)`};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    &:hover {
        transform: scale(1.15);
    }
`

const RatingLabel = styled.span`
    font-size: 0.85rem;
    color: ${themedPalette.text3};
    margin-left: 0.5rem;
`

const SubmitRow = styled.div`
    display: flex;
    justify-content: flex-end;
`

const ReviewList = styled.ul`
    width: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    list-style: none;
`

const ReviewCard = styled.li`
    width: 100%;
    border-bottom: 1px solid ${themedPalette.border2};
    padding-bottom: 1rem;
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
`

const LeftInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.4rem;
`

const Star = styled.span<{ percentage: number }>`
    display: inline-block;
    position: relative;

    background: linear-gradient(
        90deg,
        ${themedPalette.primary1} ${(props) => props.percentage}%,
        ${themedPalette.gray3} ${(props) => props.percentage}%
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

const TimeText = styled.span`
    color: ${themedPalette.text3};
    font-size: 0.85rem;
    margin-left: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
`

const UpdatedBadge = styled.span`
    font-size: 0.75rem;
    color: ${themedPalette.text3};
    white-space: nowrap;
`

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`

const Avatar = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: ${themedPalette.bg_element2};
    object-fit: cover;
`

const Nickname = styled.span`
    font-size: 0.9rem;
    color: ${themedPalette.text2};
`

const Comment = styled.p`
    font-size: 0.95rem;
    color: ${themedPalette.text1};
    margin: 0.4rem 0;
    white-space: pre-wrap;
    line-height: 1.5;
    width: 100%;
    text-align: left;
`

const EditButton = styled.button`
    background: none;
    border: 1px solid ${themedPalette.border2};
    border-radius: 4px;
    padding: 0.1rem 0.5rem;
    font-size: 0.78rem;
    color: ${themedPalette.text3};
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;

    &:hover {
        color: ${themedPalette.primary1};
        border-color: ${themedPalette.primary1};
    }
`

const EditSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
`

const EditButtonRow = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
`
