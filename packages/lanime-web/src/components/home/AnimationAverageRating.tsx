import styled from '@emotion/styled'
import { themedPalette } from '../../libs/style/theme'

interface AnimationAverageRatingProps {
    averageRating: number
    total: number
}

const AnimationAverageRating: React.FC<AnimationAverageRatingProps> = ({
    averageRating,
    total, // 총 별점 수 기본 5
}) => {
    const percentage = (averageRating / 5) * 100

    return (
        <Container>
            <Title>평균 평점</Title>
            <Average>{averageRating.toFixed(1)}</Average>
            <StarsWrapper>
                <RatingText>{`총 ${total}의 별점`}</RatingText>
                <Star percentage={percentage}>
                    {Array.from({ length: 5 }).map((_, index) => '★')}
                </Star>
            </StarsWrapper>
        </Container>
    )
}

export default AnimationAverageRating

// 스타일
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding-bottom: 12px;
`

const Title = styled.div`
    align-self: flex-start;
    font-size: 1.5rem;
    font-weight: bold;
    color: ${themedPalette.text1};
`

const Average = styled.div`
    font-size: 2.5rem;
    font-weight: bold;
    color: ${themedPalette.text1};
`

const StarsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 2rem;
    gap: 4px;
`

const RatingText = styled.div`
    font-size: 0.9rem;
    color: ${themedPalette.text3};
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
`
