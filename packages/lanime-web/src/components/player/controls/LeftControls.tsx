import styled from '@emotion/styled'
import Icon from '@components/common/Icon'
import { themedPalette } from '@/libs/style/theme'

interface LeftControlsProps {
    onRewind: () => void
}

const LeftControls: React.FC<LeftControlsProps> = ({ onRewind }) => {
    return (
        <Container>
            <IconButton aria-label="다음 화">
                <Icon
                    name="skipNext"
                    color={themedPalette.white}
                    aria-label="다음 화"
                />
            </IconButton>
            <IconButton onClick={onRewind} aria-label="10초 뒤로">
                <Icon
                    color={themedPalette.white}
                    name="rewind"
                    aria-label="10초 뒤로"
                />
            </IconButton>
        </Container>
    )
}

export default LeftControls

const Container = styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: clamp(0.25rem, 0.75vw, 0.75rem);

    @media (max-width: 360px) {
        display: none;
    }
`

const IconButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.7;
    }
`
