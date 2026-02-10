import styled from '@emotion/styled'

interface VideoPlayerProps {
    videoContainerRef: React.RefObject<HTMLDivElement | null>
    videoRef: React.RefObject<HTMLVideoElement | null>
    timeChangeHandler: () => void
    videoLoadedHandler: () => void
    children: React.ReactNode
}

const StyledVideo = styled.video`
    width: 100%;
    height: 100%;
    display: block;
`

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoContainerRef,
    videoRef,
    children,
    timeChangeHandler,
    videoLoadedHandler,
}) => {
    return (
        <VideoBlock ref={videoContainerRef}>
            <StyledVideo
                ref={videoRef}
                onTimeUpdate={timeChangeHandler}
                onLoadedMetadata={videoLoadedHandler}
            />
            {children}
        </VideoBlock>
    )
}

export default VideoPlayer

const VideoBlock = styled.div`
    position: relative;
    width: 1600px;
    height: 900px;
    background: black;
`
