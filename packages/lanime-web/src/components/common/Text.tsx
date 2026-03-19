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
    margin?: string // ✨ 추가
    padding?: string // ✨ 추가
    display?: string // ✨ span은 inline이므로 margin/padding 적용을 위해 가끔 필요함
}

const StyledText = styled.span<TextProps>`
    display: ${(props) =>
        props.display ||
        'inline-block'}; // margin/padding 적용을 위해 기본값 변경 가능
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
        { sz, color, hoverColor, margin, padding, display, children, ...rest },
        ref,
    ) => {
        return (
            <StyledText
                sz={sz}
                color={color}
                hoverColor={hoverColor}
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
