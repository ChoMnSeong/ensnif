import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'
import VideoPlayerContainer from '@containers/player/VidePlayerContainer'
import EpisodeListContainer from '@containers/player/EpisodeListContainer'
import PlayerCommentContainer from '@containers/player/PlayerCommentContainer'
import { themedPalette } from '@libs/style/theme'
import { useAnimationEpisodes } from '@libs/apis/animations'
import Flex from '@components/common/Flex'
import { env } from '@libs/env'

const PlayerPage = () => {
    const { animeId = '', videoId = '' } = useParams<{
        animeId: string
        videoId: string
    }>()

    const { data: episodes } = useAnimationEpisodes(animeId)
    const currentEpisode = episodes?.find((ep) => ep.episodeId === videoId)

    return (
        <PageWrapper>
            <Inner direction="column" gap="2rem" width="100%">
                <VideoRow gap="1rem" align="stretch">
                    <Flex flex={1} style={{ minWidth: 0 }}>
                        {currentEpisode && (
                            <VideoPlayerContainer
                                src={`${env.BASE_URL}/stream/${currentEpisode.episodeId}/index.m3u8`}
                            />
                        )}
                    </Flex>
                    <EpisodeListContainer
                        animationId={animeId}
                        currentEpisodeId={videoId}
                    />
                </VideoRow>

                {currentEpisode && (
                    <Flex direction="column" gap="0.4rem" padding="0.25rem 0">
                        <EpisodeLabel>EP.{currentEpisode.episodeNumber}</EpisodeLabel>
                        <EpisodeTitle>{currentEpisode.title}</EpisodeTitle>
                    </Flex>
                )}

                <PlayerCommentContainer episodeId={videoId} />
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

const Inner = styled(Flex)`
    padding: 0 1.5rem;

    @media (max-width: 600px) {
        padding: 0 0.75rem;
    }
`

const VideoRow = styled(Flex)`
    @media (max-width: 900px) {
        flex-direction: column;
    }
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
