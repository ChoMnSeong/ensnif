import styled from '@emotion/styled'

interface VideoPlayerProps {
    containerRef: React.RefObject<HTMLDivElement | null>
    videoRef: React.RefObject<HTMLVideoElement | null>
    onTimeUpdate: () => void
    onLoadedMetadata: () => void
    cursorHidden?: boolean
    children: React.ReactNode
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    containerRef,
    videoRef,
    children,
    onTimeUpdate,
    onLoadedMetadata,
    cursorHidden = false,
}) => {
    return (
        <Container ref={containerRef} $cursorHidden={cursorHidden}>
            <Video
                ref={videoRef}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
            />
            {children}
        </Container>
    )
}

export default VideoPlayer

const Container = styled.div<{ $cursorHidden: boolean }>`
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #000;
    overflow: hidden;
    cursor: ${({ $cursorHidden }) => ($cursorHidden ? 'none' : 'default')};

    &:fullscreen,
    &:-webkit-full-screen {
        width: 100vw;
        height: 100vh;
        aspect-ratio: unset;
    }
`

const Video = styled.video`
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
`
