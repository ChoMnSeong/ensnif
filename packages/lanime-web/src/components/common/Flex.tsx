import React from 'react'
import styled from '@emotion/styled'

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
    width?: string
    height?: string
    direction?: React.CSSProperties['flexDirection']
    wrap?: React.CSSProperties['flexWrap']
    gap?: string
    justifyContent?: React.CSSProperties['justifyContent']
    justify?: React.CSSProperties['justifyContent']
    alignItems?: React.CSSProperties['alignItems']
    align?: React.CSSProperties['alignItems']
    alignContent?: React.CSSProperties['alignContent']
    margin?: string
    padding?: string
    flex?: string | number
    as?: React.ElementType
}

const Flex: React.FC<FlexProps> = ({ children, ...props }) => {
    return <StyledFlex {...props}>{children}</StyledFlex>
}

export default Flex

const StyledFlex = styled.div<FlexProps>`
    display: flex;
    width: ${({ width }) => width || 'auto'};
    height: ${({ height }) => height || 'auto'};
    flex-direction: ${({ direction }) => direction || 'row'};
    flex-wrap: ${({ wrap }) => wrap || 'nowrap'};
    gap: ${({ gap }) => gap || '0px'};
    justify-content: ${({ justifyContent, justify }) => justify || justifyContent || 'flex-start'};
    align-items: ${({ alignItems, align }) => align || alignItems || 'stretch'};
    align-content: ${({ alignContent }) => alignContent || 'stretch'};
    padding: ${({ padding }) => padding || '0'};
    margin: ${({ margin }) => margin || '0'};
    flex: ${({ flex }) => (typeof flex === 'number' ? flex : flex || 'unset')};
`
