import styled from '@emotion/styled'

import Image from '../common/Image'

import stopCircle from '../../assets/stopCircle.svg'
import pauseCircle from '../../assets/pauseCircle.svg'

interface VideoPlayerControllerLayoutProps {
    children: React.ReactNode
    togglePlay: () => void
    isPlaying: boolean
    handleFullScreen: () => void
}

const VideoPlayerControllerLayout: React.FC<
    VideoPlayerControllerLayoutProps
> = ({ children, togglePlay, isPlaying, handleFullScreen }) => {
    const togglePlayIcon = () => {
        return (
            <Image
                src={isPlaying ? stopCircle : pauseCircle}
                width="24"
                height="24"
                alt={'toggle Play Icon'}
            />
        )
    }

    return (
        <ControllerBlock>
            <ControllerWrapper>
                <Button onClick={togglePlay}>{togglePlayIcon()}</Button>
                {children}
                <FullscreenButton onClick={handleFullScreen}>
                    ⛶
                </FullscreenButton>
            </ControllerWrapper>
        </ControllerBlock>
    )
}

export default VideoPlayerControllerLayout

const ControllerBlock = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    left: 0;
    right: 0;
    bottom: 0;
    padding-bottom: 2rem;
    background-image: linear-gradient(transparent, #000);
    transition: opacity 300ms ease-out;
    z-index: 15;
`

const ControllerWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 1em;
    padding: 0 2em;
    gap: 2em;
`

const Button = styled.button`
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
`

const FullscreenButton = styled(Button)`
    font-size: 20px;
`
