import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import { EpisodeResponse } from '@libs/apis/animations/type'
import Flex from '@components/common/Flex'
import Image from '@components/common/Image'

import { useTranslation } from 'react-i18next'

interface EpisodeListItemProps {
    episode: EpisodeResponse
    isCurrent: boolean
    onClick: () => void
}

const formatDuration = (seconds: number | null): string => {
    if (seconds == null) return ''
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
}

const EpisodeListItem: React.FC<EpisodeListItemProps> = ({
    episode,
    isCurrent,
    onClick,
}) => {
    const { t } = useTranslation()
    return (
        <Item isCurrent={isCurrent} onClick={onClick} align="center" gap="0.75rem" padding="0.75rem 1rem">
            <ThumbWrapper>
                <Thumb isCurrent={isCurrent} align="center" justify="center">
                    <Image
                        src={episode.thumbnailUrl}
                        alt={`episode ${episode.episodeNumber}`}
                        width={80}
                        height={45}
                    />
                </Thumb>
                {episode.isFinished && <FinishedBadge>{t('player.finished')}</FinishedBadge>}
                {!episode.isFinished && episode.lastWatchedSecond > 0 && episode.duration != null && episode.duration > 0 && (
                    <ProgressBarTrack>
                        <ProgressBarFill style={{ width: `${Math.min((episode.lastWatchedSecond / episode.duration) * 100, 100)}%` }} />
                    </ProgressBarTrack>
                )}
            </ThumbWrapper>
            <Flex direction="column" gap="0.3rem" flex={1} style={{ minWidth: 0 }}>
                <Title isCurrent={isCurrent}>{episode.title}</Title>
                <Flex align="center" gap="0.4rem">
                    <MetaText>EP.{episode.episodeNumber}</MetaText>
                    {episode.duration != null && (
                        <>
                            <Dot />
                            <MetaText>{formatDuration(episode.duration)}</MetaText>
                        </>
                    )}
                </Flex>
            </Flex>
        </Item>
    )
}

export default EpisodeListItem

const ThumbWrapper = styled.div`
    position: relative;
    flex-shrink: 0;
    width: 80px;
`

const FinishedBadge = styled.span`
    position: absolute;
    top: 4px;
    right: 4px;
    background: ${themedPalette.primary1};
    color: #fff;
    font-size: 0.6rem;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 3px;
    line-height: 1.4;
`

const ProgressBarTrack = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 0 0 4px 4px;
`

const ProgressBarFill = styled.div`
    height: 100%;
    background: ${themedPalette.primary1};
    border-radius: 0 0 0 4px;
`

const Item = styled(Flex)<{ isCurrent: boolean }>`
    cursor: pointer;
    transition: background 0.15s;
    background: ${({ isCurrent }) =>
        isCurrent ? 'rgba(180, 115, 249, 0.12)' : 'transparent'};
    border-left: 3px solid
        ${({ isCurrent }) => (isCurrent ? themedPalette.primary1 : 'transparent')};

    &:hover {
        background: ${themedPalette.bg_element3};
    }
`

const Thumb = styled(Flex)<{ isCurrent: boolean }>`
    width: 80px;
    aspect-ratio: 16 / 9;
    border-radius: 4px;
    background: ${({ isCurrent }) =>
        isCurrent ? 'rgba(180, 115, 249, 0.3)' : themedPalette.bg_element3};
    overflow: hidden;
`

const Title = styled.span<{ isCurrent: boolean }>`
    font-size: 0.85rem;
    font-weight: ${({ isCurrent }) => (isCurrent ? '700' : '500')};
    color: ${({ isCurrent }) =>
        isCurrent ? themedPalette.primary1 : themedPalette.text1};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const MetaText = styled.span`
    font-size: 0.75rem;
    color: ${themedPalette.text4};
`

const Dot = styled.span`
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: ${themedPalette.text4};
`
