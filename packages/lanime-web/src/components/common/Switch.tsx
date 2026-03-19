import React from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '../../libs/style/theme'
import Flex from './Flex'
import Text from './Text'

interface SwitchProps {
    label?: string
    checked: boolean
    onChange: (checked: boolean) => void
    width?: string
}

const Switch: React.FC<SwitchProps> = ({
    label,
    checked,
    onChange,
    width = '100%',
}) => {
    return (
        <Container
            width={width}
            alignItems="center"
            justifyContent="space-between"
        >
            {label && (
                <Text sz="smCt" color={themedPalette.text2}>
                    {label}
                </Text>
            )}
            <ToggleWrapper>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <Slider />
            </ToggleWrapper>
        </Container>
    )
}

export default Switch

const Container = styled(Flex)<{ width: string }>`
    width: ${({ width }) => width};
`

const ToggleWrapper = styled.label`
    position: relative;
    display: inline-block;
    width: 44px;
    height: 22px;
    cursor: pointer;

    input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    input:checked + span {
        background-color: ${themedPalette.primary1};
    }

    input:checked + span:before {
        transform: translateX(22px);
    }
`

const Slider = styled.span`
    position: absolute;
    inset: 0;
    background-color: ${themedPalette.bg_element3};
    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 22px;

    &:before {
        position: absolute;
        content: '';
        height: 18px;
        width: 18px;
        left: 2px;
        bottom: 2px;
        background-color: ${themedPalette.white};
        transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
`
