import { useEffect } from 'react'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import {
    useInfiniteAnimationReview,
    useCreateAnimationReview,
    useUpdateAnimationReview,
    useDeleteAnimationReview,
} from '@libs/apis/animations'
import { themedPalette } from '@libs/style/theme'
import AnimationReviewGraph from '@components/home/AnimationReviewGraph'
import AnimationAverageRating from '@components/home/AnimationAverageRating'
import AnimationReviewWrite from '@components/home/AnimationReviewWrite'
import AnimationReviewCard from '@components/home/AnimationReviewCard'
import Flex from '@components/common/Flex'
import { RootState } from '@stores/index'

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
    const { mutate: createReview, isPending } = useCreateAnimationReview(animationId)
    const { mutate: updateReview, isPending: isUpdating } = useUpdateAnimationReview(animationId)
    const { mutate: deleteReview } = useDeleteAnimationReview(animationId)

    const currentProfileId = useSelector((state: RootState) => state.userProfile.profileId)

    const allReviews = data?.pages.flatMap((page) => page.data.data?.reviews ?? []) ?? []
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
            if (isBottom && hasNextPage && !isFetchingNextPage) fetchNextPage()
        }

        scrollContainer.addEventListener('scroll', handleScroll)
        return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }, [scrollContainerRef, hasNextPage, isFetchingNextPage, fetchNextPage])

    return (
        <Flex direction="column" align="flex-start" width="100%" padding="1rem" gap="0">
            <SectionTitle>평균 평점</SectionTitle>
            <ReviewSummaryContainer width="100%" justify="space-around" align="center" gap="3rem" margin="0 0 1.5rem 0">
                <AnimationAverageRating averageRating={averageRating} total={totalCount} />
                <AnimationReviewGraph ratingCounts={ratingCounts} />
            </ReviewSummaryContainer>

            <AnimationReviewWrite
                onCreate={(rating, comment) => createReview({ rating, comment })}
                isPending={isPending}
            />

            <Flex as="ul" direction="column" width="100%" gap="1.25rem" padding="0" margin="0" style={{ listStyle: 'none' }}>
                {allReviews.map((review) => (
                    <AnimationReviewCard
                        key={review.reviewId}
                        review={review}
                        isOwn={currentProfileId === review.profileId}
                        onDelete={() => deleteReview()}
                        onUpdate={(rating, comment) => updateReview({ rating, comment })}
                        isUpdating={isUpdating}
                    />
                ))}
            </Flex>
        </Flex>
    )
}

export default AnimationReview

const SectionTitle = styled.span`
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    color: ${themedPalette.text2};
    margin-bottom: 0.25rem;
`

const ReviewSummaryContainer = styled(Flex)`
    @media (max-width: 480px) {
        justify-content: center;
        gap: 1.5rem;
    }
`
