import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'

const WeeklyCardSkeleton: React.FC = () => {
    return (
        <Item as="li" direction="column" gap="0.4rem">
            <ThumbSkeleton />
            <TextSkeleton wt="80%" />
            <TextSkeleton wt="50%" ht="0.7rem" />
        </Item>
    )
}

export default WeeklyCardSkeleton

const shimmer = keyframes`
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
`

const shimmerStyle = `
    background: linear-gradient(
        50deg,
        ${themedPalette.bg_element3} 25%,
        ${themedPalette.bg_element4} 50%,
        ${themedPalette.bg_element3} 75%
    );
    background-size: 200% 100%;
    animation-name: shimmer;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
`

const Item = styled(Flex)`
    list-style: none;
    width: 100%;
`

const ThumbSkeleton = styled.div`
    ${shimmerStyle}
    width: 100%;
    aspect-ratio: 100 / 55.7047;
    border-radius: 0.5rem;
    animation: ${shimmer} 1.5s infinite;
`

const TextSkeleton = styled.div<{ wt?: string; ht?: string }>`
    ${shimmerStyle}
    width: ${({ wt }) => wt ?? '100%'};
    height: ${({ ht }) => ht ?? '0.8rem'};
    border-radius: 4px;
    animation: ${shimmer} 1.5s infinite;
`
