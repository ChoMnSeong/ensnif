import styled from '@emotion/styled'

interface FlexProps {
    children: React.ReactNode
    direction?: 'row' | 'column' | 'revers-row' | 'reverse-column'
    gap?: string
    justifyItems?: string
    justifyContent?: string
    alignItems?: string
    alignContent?: string
    margin?: string
    padding?: string
}

const Flex: React.FC<FlexProps> = (props) => {
    return <StyledFlex {...props}>{props.children}</StyledFlex>
}

export default Flex

const StyledFlex = styled.div<FlexProps>`
    display: flex;
    flex-direction: ${(props) => props.direction || 'row'};
    gap: ${(props) => props.gap || '0px'};
    justify-items: ${(props) => props.justifyItems || 'center'};
    justify-content: ${(props) => props.justifyContent || 'center'};
    align-items: ${(props) => props.alignItems || 'center'};
    align-content: ${(props) => props.alignContent || 'center'};
    padding: ${(props) => props.padding || '0'};
    margin: ${(props) => props.margin || '0'};
`
