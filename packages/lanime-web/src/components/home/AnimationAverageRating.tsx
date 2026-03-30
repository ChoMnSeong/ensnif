import React from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'

interface AnimationAverageRatingProps {
    averageRating: number
    total: number
}

const AnimationAverageRating: React.FC<AnimationAverageRatingProps> = ({
    averageRating,
    total,
}) => {
    const percentage = (averageRating / 5) * 100

    return (
        <Flex direction="column" align="center" gap="1rem" padding="0 0 12px 0">
            <Average>{averageRating.toFixed(1)}</Average>
            <Flex direction="column" align="center" gap="4px">
                <RatingText>{`총 ${total}의 별점`}</RatingText>
                <Star percentage={percentage}>
                    {Array.from({ length: 5 }).map(() => '★')}
                </Star>
            </Flex>
        </Flex>
    )
}

export default AnimationAverageRating

const Average = styled.div`
    font-size: 2.5rem;
    font-weight: bold;
    color: ${themedPalette.text1};
`

const RatingText = styled.div`
    font-size: 0.9rem;
    color: ${themedPalette.text3};
`

const Star = styled.span<{ percentage: number }>`
    display: inline-block;
    position: relative;
    font-size: 2rem;

    background: linear-gradient(
        90deg,
        ${themedPalette.primary1} ${(props) => props.percentage}%,
        ${themedPalette.gray3} ${(props) => props.percentage}%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: background 0.3s ease;
`
