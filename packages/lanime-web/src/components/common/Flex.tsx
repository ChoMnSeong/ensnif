import React from 'react'
import styled from '@emotion/styled'

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
    width?: string
    height?: string
    direction?: React.CSSProperties['flexDirection']
    wrap?: React.CSSProperties['flexWrap']
    gap?: string
    justifyItems?: React.CSSProperties['justifyItems']
    justifyContent?: React.CSSProperties['justifyContent']
    alignItems?: React.CSSProperties['alignItems']
    alignContent?: React.CSSProperties['alignContent']
    margin?: string
    padding?: string
    flex?: string
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
    justify-items: ${({ justifyItems }) => justifyItems || 'center'};
    justify-content: ${({ justifyContent }) => justifyContent || 'center'};
    align-items: ${({ alignItems }) => alignItems || 'center'};
    align-content: ${({ alignContent }) => alignContent || 'center'};
    padding: ${({ padding }) => padding || '0'};
    margin: ${({ margin }) => margin || '0'};
    flex: ${({ flex }) => flex || 'unset'};
`
