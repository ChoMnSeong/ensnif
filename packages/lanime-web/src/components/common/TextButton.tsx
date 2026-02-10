import styled from '@emotion/styled'
import Button, { ButtonPropsProps } from './Button'
import React from 'react'
import useFilteredProps from '../../libs/hooks/useFilteredProps'
import { keyframes } from '@emotion/react'

type IconProps = {
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
}
type OtherProps = { color: string; sz: string; active: boolean }
type TextButtonProps = ButtonPropsProps & IconProps & OtherProps

const included = [
    'className',
    'children',
    'startIcon',
    'endIcon',
    'color',
    'sz',
    'disabled',
    'active',
]

const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(
    function TextButton(props, ref) {
        const { color, startIcon, endIcon, children, active, sz, className } =
            props

        const others = useFilteredProps(props, included) as Omit<
            ButtonPropsProps,
            'children' | 'className'
        >
        return (
            <TextButtonBlock
                color={color}
                sz={sz}
                active={active}
                ref={ref}
                className={className}
                {...others}
            >
                {startIcon}
                {children}
                {endIcon}
                <TextButtonBottomBar color={color} active={active} />
            </TextButtonBlock>
        )
    },
)

const FontWeightKeyFrame = keyframes`
  0%{
    font-weight: 400
  }
  100%{
    font-weight: 600
  }
`

const BorderBottomKeyFrame = keyframes`
  0%{
    width: 0
  }
  100%{
    width: 100%
  }
`

const TextButtonBlock = styled(Button)<OtherProps>`
    color: ${({ color }) => color || '#1a1a1a'};
    padding: 1px 2px;
    font-size: ${({ sz }) => (sz === 'small' ? '14px' : '18px')};
    font-weight: ${({ active }) => (active ? 600 : 400)};
    font-family: Roboto;
    line-height: 20px;
    overflow: hidden;
    animation: ${({ active }) => active && FontWeightKeyFrame} 1s;
`

const TextButtonBottomBar = styled.div<{ color: string; active: boolean }>`
    content: '';
    position: absolute;
    bottom: 0;
    left: ${({ active }) => (active ? 0 : '-100%')};
    width: ${({ active }) => (active ? '100%' : 0)};
    height: 1px;
    background-color: ${({ color }) => color || '#1a1a1a'};
    animation: ${({ active }) => active && BorderBottomKeyFrame} 1s;
`

export default TextButton
