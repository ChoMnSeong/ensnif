import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'

const LibraryCardSkeleton: React.FC = () => {
    return (
        <Wrapper direction="column" gap="0.5rem">
            <ThumbSkeleton />
            <TextSkeleton wt="75%" />
            <TextSkeleton wt="40%" ht="0.75rem" />
        </Wrapper>
    )
}

export default LibraryCardSkeleton

const shimmer = keyframes`
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
`

const shimmerBase = `
    background: linear-gradient(
        50deg,
        var(--sk-base) 25%,
        var(--sk-shine) 50%,
        var(--sk-base) 75%
    );
    background-size: 200% 100%;
`

const Wrapper = styled(Flex)`
    --sk-base: ${themedPalette.bg_element3};
    --sk-shine: ${themedPalette.bg_element4};
    min-width: 0;
`

const ThumbSkeleton = styled.div`
    ${shimmerBase}
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 0.5rem;
    animation: ${shimmer} 1.5s infinite;
`

const TextSkeleton = styled.div<{ wt?: string; ht?: string }>`
    ${shimmerBase}
    width: ${({ wt }) => wt ?? '100%'};
    height: ${({ ht }) => ht ?? '0.875rem'};
    border-radius: 4px;
    animation: ${shimmer} 1.5s infinite;
`
