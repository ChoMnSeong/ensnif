import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import Image from '@components/common/Image'
import Text from '@components/common/Text'
import { themedPalette } from '@libs/style/theme'

interface AnimeEpisodeCardProps {
    animationId: string
    episodeId: string
    episodeNumber: number
    title: string
    description: string
    thumbnailUrl: string
    duration: number | null
    handleEpisodeClick: () => void
}

const formatDuration = (seconds: number | null): string => {
    if (seconds == null) return ''
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
}

const AnimeEpisodeCard: React.FC<AnimeEpisodeCardProps> = ({
    episodeNumber,
    animationId,
    episodeId,
    title,
    description,
    thumbnailUrl,
    duration,
    handleEpisodeClick,
}) => {
    const navigate = useNavigate()

    const handleClick = () => {
        localStorage.setItem('hasInteracted', 'true')
        handleEpisodeClick()
        navigate(`/player/${animationId}/${episodeId}`)
    }

    return (
        <Card onClick={handleClick}>
            <Thumbnail>
                <Image
                    src={thumbnailUrl}
                    alt={`episode ${episodeNumber}`}
                    width={'100%'}
                    height={'100%'}
                    $aspectRatio="16/9"
                />
            </Thumbnail>
            <Content>
                <TopArea>
                    <EpisodeTitle sz={'smTl'} color={themedPalette.text1}>
                        제{episodeNumber}화 {title}
                    </EpisodeTitle>
                    {duration != null && (
                        <DurationText sz={'smCt'} color={themedPalette.text4}>
                            {formatDuration(duration)}
                        </DurationText>
                    )}
                </TopArea>
                <Description sz={'smCt'} color={themedPalette.text3}>
                    {description}
                </Description>
            </Content>
        </Card>
    )
}

export default AnimeEpisodeCard

const Card = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    cursor: pointer;
    padding: 0.75rem 0;
    border-bottom: 1px solid ${themedPalette.border2};

    &:last-child {
        border-bottom: none;
    }

    @media (max-width: 480px) {
        padding: 0.75rem 1rem;
    }
`

const Thumbnail = styled.div`
    flex-shrink: 0;
    width: 200px;
    align-self: stretch;
    border-radius: 4px;
    overflow: hidden;

    @media (max-width: 480px) {
        width: 140px;
    }
`

const Content = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0 1rem;
`

const TopArea = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`

const EpisodeTitle = styled(Text)`
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
`

const DurationText = styled(Text)``

const Description = styled(Text)`
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
`
