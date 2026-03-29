import { useNavigate } from 'react-router-dom'
import EpisodePanel from '@components/player/EpisodePanel'
import EpisodeListItem from '@components/player/EpisodeListItem'
import { useAnimationEpisodes } from '@libs/apis/animations'

interface EpisodeListContainerProps {
    animationId: string
    currentEpisodeId: string
}

const EpisodeListContainer: React.FC<EpisodeListContainerProps> = ({
    animationId,
    currentEpisodeId,
}) => {
    const navigate = useNavigate()
    const { data: episodes } = useAnimationEpisodes(animationId)

    return (
        <EpisodePanel>
            {episodes?.map((episode) => (
                <EpisodeListItem
                    key={episode.episodeId}
                    episode={episode}
                    isCurrent={episode.episodeId === currentEpisodeId}
                    onClick={() =>
                        navigate(`/player/${animationId}/${episode.episodeId}`)
                    }
                />
            ))}
        </EpisodePanel>
    )
}

export default EpisodeListContainer
