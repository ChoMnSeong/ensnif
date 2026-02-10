import VideoPlayerContainer from '../containers/player/VidePlayerContainer'

const PlayerPage = () => {
    const src =
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    return <VideoPlayerContainer src={src} />
}

export default PlayerPage
