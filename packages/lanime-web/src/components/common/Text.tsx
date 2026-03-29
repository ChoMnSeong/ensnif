import React, { forwardRef } from 'react'
import styled from '@emotion/styled'

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
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
    hoverColor?: string
    weight?: React.CSSProperties['fontWeight']
    margin?: string
    padding?: string
    display?: string
}

const StyledText = styled.span<TextProps>`
    display: ${(props) =>
        props.display ||
        'inline-block'};
    margin: ${(props) => props.margin || '0'};
    padding: ${(props) => props.padding || '0'};

    font-size: ${(props) => {
        switch (props.sz) {
            case 'lgTl':
                return '2em'
            case 'mdTl':
                return '1.5em'
            case 'smTl':
                return '1em'
            case 'lgCt':
                return '1.25em'
            case 'mdCt':
                return '1em'
            case 'smCt':
                return '0.875em'
            case 'lgBt':
                return '1.375em'
            case 'mdBt':
                return '1.125em'
            case 'smBt':
                return '0.875em'
            default:
                return '1em'
        }
    }};

    font-weight: ${(props) => {
        if (props.weight !== undefined) return props.weight
        switch (props.sz) {
            case 'lgTl':
            case 'mdTl':
                return 'bold'
            case 'lgCt':
            case 'mdCt':
                return '400'
            case 'lgBt':
                return '500'
            default:
                return 'normal'
        }
    }};

    color: ${(props) => props.color};
    transition: color 0.2s ease;

    &:hover {
        color: ${(props) => props.hoverColor || props.color};
    }
`

const Text = forwardRef<HTMLSpanElement, TextProps>(
    (
        { sz, color, hoverColor, weight, margin, padding, display, children, ...rest },
        ref,
    ) => {
        return (
            <StyledText
                sz={sz}
                color={color}
                hoverColor={hoverColor}
                weight={weight}
                margin={margin}
                padding={padding}
                display={display}
                ref={ref}
                {...rest}
            >
                {children}
            </StyledText>
        )
    },
)

export default Text
