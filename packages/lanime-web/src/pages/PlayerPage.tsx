import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'
import VideoPlayerContainer from '@containers/player/VidePlayerContainer'
import EpisodeListContainer from '@containers/player/EpisodeListContainer'
import PlayerCommentContainer from '@containers/player/PlayerCommentContainer'
import { themedPalette } from '@libs/style/theme'
import { useAnimationEpisodes } from '@libs/apis/animations'

const PlayerPage = () => {
    const { animeId = '', videoId = '' } = useParams<{
        animeId: string
        videoId: string
    }>()

    const { data: episodes } = useAnimationEpisodes(animeId)
    const currentEpisode = episodes?.find((ep) => ep.episodeId === videoId)

    return (
        <PageWrapper>
            <Inner>
                <VideoRow>
                    <VideoWrapper>
                        {currentEpisode && (
                            <VideoPlayerContainer src={currentEpisode.videoUrl} />
                        )}
                    </VideoWrapper>
                    <EpisodeListContainer
                        animationId={animeId}
                        currentEpisodeId={videoId}
                    />
                </VideoRow>

                {currentEpisode && (
                    <EpisodeMeta>
                        <EpisodeLabel>EP.{currentEpisode.episodeNumber}</EpisodeLabel>
                        <EpisodeTitle>{currentEpisode.title}</EpisodeTitle>
                    </EpisodeMeta>
                )}

                <PlayerCommentContainer />
            </Inner>
        </PageWrapper>
    )
}

export default PlayerPage

const PageWrapper = styled.div`
    width: 100%;
    background: ${themedPalette.bg_page1};
    padding: 1rem 0 3rem;
`

const Inner = styled.div`
    width: 100%;
    padding: 0 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    @media (max-width: 600px) {
        padding: 0 0.75rem;
    }
`

const VideoRow = styled.div`
    display: flex;
    gap: 1rem;
    align-items: stretch;

    @media (max-width: 900px) {
        flex-direction: column;
    }
`

const VideoWrapper = styled.div`
    flex: 1 1 0;
    min-width: 0;
`

const EpisodeMeta = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.25rem 0;
`

const EpisodeLabel = styled.span`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${themedPalette.primary1};
    text-transform: uppercase;
    letter-spacing: 0.08em;
`

const EpisodeTitle = styled.h2`
    font-size: 1.2rem;
    font-weight: 700;
    color: ${themedPalette.text1};
    margin: 0;
`
