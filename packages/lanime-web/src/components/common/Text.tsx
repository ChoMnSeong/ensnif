import styled from '@emotion/styled'
import { forwardRef } from 'react'

interface TextProps {
    sz:
        | 'lgTl'
        | 'mdTl'
        | 'smTl'
        | 'lgCt'
        | 'mdCt'
        | 'smCt'
        | 'lgBt'
        | 'mdBt'
        | 'smBt'
    color: string
    children: React.ReactNode
}

const StyledText = styled.span<TextProps>`
    font-size: ${(props) => {
        switch (props.sz) {
            case 'lgTl':
                return '2em' // large title
            case 'mdTl':
                return '1.5em' // medium title
            case 'smTl':
                return '1em' // small title
            case 'lgCt':
                return '1.25em' // large content
            case 'mdCt':
                return '1em' // medium content
            case 'smCt':
                return '0.875em' // small content
            case 'lgBt':
                return '1.375em' // large button
            case 'mdBt':
                return '1.125em' // medium button
            case 'smBt':
                return '0.875em' // small button
            default:
                return '1em' // default font-size
        }
    }};
    font-weight: ${(props) => {
        switch (props.sz) {
            case 'lgTl':
            case 'mdTl':
                return 'bold' // bold for large titles
            case 'lgCt':
            case 'mdCt':
                return '400' // medium weight for content
            case 'lgBt':
                return '500' // bold for buttons
            default:
                return 'normal' // regular weight for other cases
        }
    }};
    color: ${(props) => props.color};
`

const Text = forwardRef<HTMLSpanElement, TextProps>(
    ({ sz, color, children, ...rest }, ref) => {
        return (
            <StyledText sz={sz} color={color} ref={ref} {...rest}>
                {children}
            </StyledText>
        )
    },
)

export default Text
