import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'

interface SkeletonProps {
    wt: string
    ht: string
    br?: string
    margin?: string
    padding?: string
}

const Skeleton: React.FC<SkeletonProps> = (props) => {
    return <SkeletonContainer {...props} />
}

export default Skeleton

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`

const SkeletonContainer = styled.div<SkeletonProps>`
    background: linear-gradient(
        50deg,
        ${themedPalette.bg_element3} 25%,
        ${themedPalette.bg_element4} 50%,
        ${themedPalette.bg_element3} 75%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;

    width: ${({ wt }) => wt};
    height: ${({ ht }) => ht};
    margin: ${({ margin }) => margin || '0'};
    padding: ${({ padding }) => padding || '0'};
    border-radius: ${({ br }) => br || 0};
`
