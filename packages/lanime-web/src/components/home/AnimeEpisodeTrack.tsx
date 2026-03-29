import styled from '@emotion/styled'
import AnimeEpisodeCard from '@components/home/AnimeEpisodeCard'
import { useAnimationEpisodes } from '@libs/apis/animations'

interface AnimeEpisodeTrackProps {
    animationId: string
    handleEpisodeClick: () => void
}

const AnimeEpisodeTrack: React.FC<AnimeEpisodeTrackProps> = ({
    animationId,
    handleEpisodeClick,
}) => {
    const { data: episodes } = useAnimationEpisodes(animationId)

    return (
        <AnimeEpisodeTrackContainer>
            {episodes?.map((episode) => (
                <AnimeEpisodeCard
                    key={episode.episodeId}
                    episodeId={episode.episodeId}
                    episodeNumber={episode.episodeNumber}
                    title={episode.title}
                    description={episode.description}
                    thumbnailUrl={episode.thumbnailUrl}
                    duration={episode.duration}
                    animationId={animationId}
                    handleEpisodeClick={handleEpisodeClick}
                />
            ))}
        </AnimeEpisodeTrackContainer>
    )
}

export default AnimeEpisodeTrack

const AnimeEpisodeTrackContainer = styled.div`
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
`
