import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import { EpisodeResponse } from '@libs/apis/animations/type'
import Flex from '@components/common/Flex'
import Image from '@components/common/Image'

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
    return (
        <Item isCurrent={isCurrent} onClick={onClick} align="center" gap="0.75rem" padding="0.75rem 1rem">
            <Thumb isCurrent={isCurrent} align="center" justify="center">
                <Image
                    src={episode.thumbnailUrl}
                    alt={`episode ${episode.episodeNumber}`}
                    width={80}
                    height={45}
                />
            </Thumb>
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
    flex-shrink: 0;
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
