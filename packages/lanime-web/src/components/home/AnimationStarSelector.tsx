import React from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'

interface AnimationStarSelectorProps {
    rating: number
    hoverRating: number
    onRatingChange: (rating: number) => void
    onHoverChange: (rating: number) => void
}

const AnimationStarSelector: React.FC<AnimationStarSelectorProps> = ({
    rating,
    hoverRating,
    onRatingChange,
    onHoverChange,
}) => {
    const display = hoverRating || rating

    return (
        <Flex justify="flex-start" align="center" gap="0.15rem">
            {[1, 2, 3, 4, 5].map((star) => {
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
                        type="button"
                        aria-label={`${star}점`}
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const isLeft = e.clientX - rect.left < rect.width / 2
                            onHoverChange(isLeft ? star - 0.5 : star)
                        }}
                        onMouseLeave={() => onHoverChange(0)}
                        onClick={() => onRatingChange(hoverRating || star)}
                    >
                        ★
                    </StarButton>
                )
            })}
            <RatingLabel as="span" margin="0 0 0 0.5rem">
                {display > 0 ? `${display}점` : '별점을 선택하세요'}
            </RatingLabel>
        </Flex>
    )
}

export default AnimationStarSelector

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

const RatingLabel = styled(Flex)`
    font-size: 0.85rem;
    color: ${themedPalette.text3};
`
