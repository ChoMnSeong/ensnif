import ButtonTag from './ButtonTag'
import styled from '@emotion/styled'

interface CircleTagProps {
    children: React.ReactNode
    active: boolean
    onClick: (e: unknown) => void
}

const CircleTag: React.FC<CircleTagProps> = (props) => {
    return <StyledCircleTag {...props}>{props.children}</StyledCircleTag>
}

export default CircleTag

const StyledCircleTag = styled(ButtonTag)`
    border-radius: 50%;
    min-width: 3.75em;
    width: 3.75em;
    border: none;
    padding: 0;
`
