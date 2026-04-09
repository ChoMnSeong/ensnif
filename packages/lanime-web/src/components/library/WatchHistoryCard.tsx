import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import Image from '@components/common/Image'
import Flex from '@components/common/Flex'
import { themedPalette } from '@libs/style/theme'
import { WatchHistoryEpisode } from '@libs/apis/library/type'
import { useTranslation } from 'react-i18next'

interface WatchHistoryCardProps {
    episode: WatchHistoryEpisode
    onClick: () => void
}

const WatchHistoryCard: React.FC<WatchHistoryCardProps> = ({ episode, onClick }) => {
    const { t } = useTranslation()
    const progressPercent =
        episode.duration > 0
            ? Math.min((episode.lastWatchedSecond / episode.duration) * 100, 100)
            : 0

    return (
        <Card onClick={onClick}>
            <ThumbWrapper>
                <Image
                    src={episode.thumbnailUrl}
                    alt={episode.title}
                    height="auto"
                    width="100%"
                    $aspectRatio="16/9"
                    borderRadius="0.5rem"
                    loading="lazy"
                />
                <Overlay>
                    <PlayButton>
                        <PlayIcon />
                    </PlayButton>
                </Overlay>
                {episode.isFinished && <FinishedBadge>{t('library.finished')}</FinishedBadge>}
                {progressPercent > 0 && (
                    <ProgressTrack>
                        <ProgressFill style={{ width: `${progressPercent}%` }} />
                    </ProgressTrack>
                )}
            </ThumbWrapper>

            <InfoBlock direction="column" gap="0.2rem">
                <AnimationTitle>{episode.animationTitle}</AnimationTitle>
                <EpisodeLabel>{t('library.episode', { number: episode.episodeNumber })}</EpisodeLabel>
            </InfoBlock>
        </Card>
    )
}

export default WatchHistoryCard

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`

const Overlay = styled.div`
    position: absolute;
    inset: 0;
    border-radius: 0.5rem;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
`

const PlayButton = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`

const PlayIcon = styled.div`
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 8px 0 8px 14px;
    border-color: transparent transparent transparent #1a1a1a;
    margin-left: 3px;
`

const ThumbWrapper = styled.div`
    position: relative;
    border-radius: 0.5rem;
    overflow: hidden;
`

const FinishedBadge = styled.span`
    position: absolute;
    top: 6px;
    right: 6px;
    background: ${themedPalette.primary1};
    color: #fff;
    font-size: 0.6rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 3px;
    line-height: 1.4;
    z-index: 1;
`

const ProgressTrack = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.25);
`

const ProgressFill = styled.div`
    height: 100%;
    background: ${themedPalette.primary1};
`

const InfoBlock = styled(Flex)`
    padding: 0.5rem 0.1rem 0;
`

const AnimationTitle = styled.span`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${themedPalette.text1};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const EpisodeLabel = styled.span`
    font-size: 0.8rem;
    font-weight: 700;
    color: ${themedPalette.text2};
`

const Card = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    min-width: 0;

    &:hover ${Overlay} {
        opacity: 1;
        animation: ${fadeIn} 0.2s ease;
    }
`
