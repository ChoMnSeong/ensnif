import styled from '@emotion/styled'
import Icon from '@components/common/Icon'
import { themedPalette } from '@/libs/style/theme'

interface PlayerControlsProps {
    children: React.ReactNode
    isPlaying: boolean
    visible: boolean
    onTogglePlay: () => void
    onToggleFullscreen: () => void
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
    children,
    isPlaying,
    visible,
    onTogglePlay,
    onToggleFullscreen,
}) => {
    return (
        <Overlay $visible={visible}>
            <ControlsRow $visible={visible}>
                <IconButton
                    onClick={onTogglePlay}
                    aria-label={isPlaying ? '일시정지' : '재생'}
                >
                    <Icon
                        color={themedPalette.white}
                        name={isPlaying ? 'stopCircle' : 'pauseCircle'}
                        aria-label={isPlaying ? '일시정지' : '재생'}
                    />
                </IconButton>

                {children}

                <FullscreenButton
                    onClick={onToggleFullscreen}
                    aria-label="전체화면"
                >
                    <Icon
                        color={themedPalette.white}
                        name="fullscreen"
                        aria-label="전체화면"
                    />
                </FullscreenButton>
            </ControlsRow>
        </Overlay>
    )
}

export default PlayerControls

const Overlay = styled.div<{ $visible: boolean }>`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background: linear-gradient(transparent 50%, rgba(0, 0, 0, 0.8));
    z-index: 15;
    pointer-events: none;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transition: opacity 0.3s ease;
`

const ControlsRow = styled.div<{ $visible: boolean }>`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 clamp(0.5rem, 2vw, 1.5rem);
    padding-bottom: clamp(0.5rem, 2vw, 1.5rem);
    gap: clamp(0.25rem, 1vw, 0.75rem);
    pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
`

const IconButton = styled.button`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.75;
    }
`

const FullscreenButton = styled(IconButton)`
    margin-left: auto;
`
