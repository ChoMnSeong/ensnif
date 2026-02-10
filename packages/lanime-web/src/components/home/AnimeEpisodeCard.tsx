import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom' // ✅ 추가
import Image from '../common/Image'
import Text from '../common/Text'
import { themedPalette } from '../../libs/style/theme'

interface AnimeEpisodeCardProps {
    imageUrl: string
    animationId: string
    episodeId: string
    episodeNumber: string
    description: string
    handleEpisodeClick: () => void
}

const AnimeEpisodeCard: React.FC<AnimeEpisodeCardProps> = ({
    imageUrl,
    episodeNumber,
    animationId,
    episodeId = 'someEpisodeId',
    description = 'someAnimationId',
    handleEpisodeClick,
}) => {
    const navigate = useNavigate()

    const handleInteraction = () => {
        localStorage.setItem('hasInteracted', 'true')
    }

    const handleClick = () => {
        handleEpisodeClick()
        handleInteraction()
        navigate(`/player/${animationId}/${episodeId}`)
    }

    return (
        <Card onClick={handleClick}>
            <Image
                src={imageUrl}
                alt={`episode ${episodeNumber}`}
                width={'160px'}
                height={'90px'}
            />
            <Content>
                <Text sz={'smTl'} color={themedPalette.text1}>
                    에피소드 {episodeNumber}화
                </Text>
                <Description sz={'smCt'} color={themedPalette.text2}>
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
`

const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    padding: 0 1rem;
`

const Description = styled(Text)`
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
`
