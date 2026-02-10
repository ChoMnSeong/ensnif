import styled from '@emotion/styled'
import Text from './Text'
import { themedPalette } from '../../libs/style/theme'

interface ButtonTagProps {
    children: React.ReactNode
    className?: string
    active: boolean
    disabled?: boolean
    width?: string
    onClick: (e: unknown) => void
}

const ButtonTag: React.FC<ButtonTagProps> = (props) => {
    return (
        <StyledButton {...props}>
            <Text sz={'lgBt'} color={themedPalette.white}>
                {props.children}
            </Text>
        </StyledButton>
    )
}

const StyledButton = styled.button<ButtonTagProps>`
    background-color: ${(props) =>
        props.active
            ? `${themedPalette.primary1}`
            : `${themedPalette.disabled}`};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    outline: 0;
    border: 0.5px solid black;
    border-radius: 15%;
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
    user-select: none;
    height: 3.75em;
    min-width: 6em;
    width: 6em;
    padding: 0 1rem;

    &:hover {
        background-color: ${(props) =>
            props.disabled
                ? props.active
                    ? `${themedPalette.disabled}` // disabled이면 hover 안 변함
                    : `${themedPalette.primary1}`
                : props.active
                  ? `${themedPalette.primary1}` // active일 때 hover 시 밝게
                  : `${themedPalette.primary2}`}; // 비활성 active 아닌 버튼 hover 색
    }
`

export default ButtonTag
