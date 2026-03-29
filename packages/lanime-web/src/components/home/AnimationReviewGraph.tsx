import styled from '@emotion/styled'
import { RatingCount } from '@containers/home/AnimationReview'
import { themedPalette } from '@libs/style/theme'

interface AnimationReviewGraphProps {
    ratingCounts: RatingCount[]
}

const AnimationReviewGraph: React.FC<AnimationReviewGraphProps> = ({
    ratingCounts,
}) => {
    const minHeight = 5

    const allBars = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5].map((rating) => {
        const found = ratingCounts.find((r) => r.rating === rating)
        return { rating, count: found?.count ?? 0 }
    })

    const maxCount = Math.max(...allBars.map((r) => r.count), 0)

    return (
        <GraphContainer>
            {allBars.map((r) => {
                const rawPercent = maxCount > 0 ? (r.count / maxCount) * 100 : 0
                const heightPercent = Math.max(rawPercent, minHeight)
                const color =
                    maxCount > 0 && r.count === maxCount
                        ? themedPalette.primary1
                        : themedPalette.primary2
                const isHalf = r.rating % 1 !== 0

                return (
                    <BarColumn key={r.rating}>
                        <BarFiller height={heightPercent} color={color} />
                        <StarLabel>{isHalf ? '\u00A0' : r.rating}</StarLabel>
                    </BarColumn>
                )
            })}
        </GraphContainer>
    )
}

export default AnimationReviewGraph

const GraphContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    height: 10rem;

    @media (max-width: 480px) {
        width: 100%;
        gap: 0.25rem;
    }
`

const BarColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    width: 20px;
    height: 100%;

    @media (max-width: 480px) {
        flex: 1;
        width: auto;
        min-width: 0;
    }
`

const BarFiller = styled.div<{ height: number; color: string }>`
    width: 100%;
    height: ${(props) => Math.min(props.height, 100)}%;
    background: ${(props) => props.color};
    transition: height 0.5s ease-out;
    border-radius: 4px 4px 0 0;
`

const StarLabel = styled.div`
    text-align: center;
    font-size: 12px;
    color: ${themedPalette.text3};
    height: 16px;
`
