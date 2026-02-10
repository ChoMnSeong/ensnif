import { useEffect } from 'react'
import styled from '@emotion/styled'
import { useInfiniteAnimationReview } from '../../libs/apis/animation'
import { themedPalette } from '../../libs/style/theme'
import AnimationReviewGraph from '../../components/home/AnimationReviewGraph'
import AnimationAverageRating from '../../components/home/AnimationAverageRating'
import { validImageURL } from '../../libs/validImageURL'

export interface RatingCount {
    rating: number
    count: number
}

interface AnimationReviewProps {
    animationId: string
    scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

const AnimationReview: React.FC<AnimationReviewProps> = ({
    animationId,
    scrollContainerRef,
}) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteAnimationReview(animationId)

    const allReviews =
        data?.pages.flatMap((page) => page.data.data.reviews) ?? []

    const firstPageData = data?.pages[0]?.data.data
    const averageRating = firstPageData?.averageRating ?? 0
    const totalCount = firstPageData?.reviews.length ?? 0
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

    return (
        <Container>
            <ReviewSummaryContainer>
                <AnimationAverageRating
                    averageRating={averageRating}
                    total={totalCount}
                />
                <AnimationReviewGraph ratingCounts={ratingCounts} />
            </ReviewSummaryContainer>

            <ReviewList>
                {allReviews.map((review) => (
                    <ReviewCard key={review.reviewId}>
                        <Header>
                            <LeftInfo>
                                <Star percentage={(review.rating / 5) * 100}>
                                    {Array.from({ length: 5 }).map(
                                        () => '★',
                                    )}
                                </Star>
                                <RatingScore>
                                    {review.rating.toFixed(1)}
                                </RatingScore>
                                <TimeText>
                                    {new Date(
                                        review.createdAt,
                                    ).toLocaleDateString('ko-KR', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
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

                        <Comment>{review.comment}</Comment>
                    </ReviewCard>
                ))}
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
    margin-bottom: 1.5rem;
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
