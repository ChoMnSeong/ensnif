import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'

const SearchCardSkeleton: React.FC = () => {
    return (
        <Wrapper gap="1rem" align="center">
            <ThumbSkeleton />
            <ContentSkeleton direction="column" gap="0.5rem" flex={1}>
                <TextSkeleton wt="30%" ht="1.1rem" />
                <TextSkeleton wt="80%" ht="1rem" />
                <TextSkeleton wt="50%" ht="0.875rem" />
            </ContentSkeleton>
        </Wrapper>
    )
}

export default SearchCardSkeleton

const shimmer = keyframes`
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
`

const base = `
    background: linear-gradient(
        50deg,
        ${themedPalette.bg_element3} 25%,
        ${themedPalette.bg_element4} 50%,
        ${themedPalette.bg_element3} 75%
    );
    background-size: 200% 100%;
`

const Wrapper = styled(Flex)`
    width: 100%;
    padding: 0.5rem;
    list-style: none;
`

const ThumbSkeleton = styled.div`
    ${base}
    flex: 0 0 40%;
    max-width: 40%;
    aspect-ratio: 2 / 3;
    border-radius: 0.5rem;
    animation: ${shimmer} 1.5s infinite;
`

const ContentSkeleton = styled(Flex)`
    min-width: 0;
`

const TextSkeleton = styled.div<{ wt?: string; ht?: string }>`
    ${base}
    width: ${({ wt }) => wt ?? '100%'};
    height: ${({ ht }) => ht ?? '0.875rem'};
    border-radius: 4px;
    animation: ${shimmer} 1.5s infinite;
`
