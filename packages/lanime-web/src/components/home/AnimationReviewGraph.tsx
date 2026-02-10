import styled from '@emotion/styled'
import { RatingCount } from '../../containers/home/AnimationReview'
import { themedPalette } from '../../libs/style/theme'

interface AnimationReviewGraphProps {
    ratingCounts: RatingCount[]
}

const AnimationReviewGraph: React.FC<AnimationReviewGraphProps> = ({
    ratingCounts,
}) => {
    const maxCount = Math.max(...ratingCounts.map((r) => r.count)) // 가장 높은 count 기준
    const minHeight = 5 // 최소 표시 높이 %

    return (
        <GraphContainer>
            {ratingCounts
                .sort((a, b) => a.rating - b.rating)
                .map((r) => {
                    const rawPercent = maxCount ? (r.count / maxCount) * 100 : 0
                    const heightPercent = Math.max(rawPercent, minHeight)
                    const color =
                        r.count === maxCount
                            ? themedPalette.primary1
                            : themedPalette.primary2

                    return (
                        <BarColumn key={r.rating}>
                            <BarFiller height={heightPercent} color={color} />
                            <StarLabel>
                                {Number.isInteger(r.rating)
                                    ? r.rating
                                    : '\u00A0'}
                            </StarLabel>
                        </BarColumn>
                    )
                })}
        </GraphContainer>
    )
}

export default AnimationReviewGraph

const GraphContainer = styled.div`
    display: flex;
    gap: 1rem;
    height: 10rem;
`

const BarColumn = styled.div`
    display: flex;
    flex-direction: column; // 레이블 위에 바가 올라오도록
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    width: 24px;
    height: 100%;
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
    height: 16px; // 고정 높이로 공간 확보
`
