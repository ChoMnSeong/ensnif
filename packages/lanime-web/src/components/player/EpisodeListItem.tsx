import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import { EpisodeResponse } from '@libs/apis/animations/type'
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
        <Item isCurrent={isCurrent} onClick={onClick}>
            <Thumb isCurrent={isCurrent}>
                <Image
                    src={episode.thumbnailUrl}
                    alt={`episode ${episode.episodeNumber}`}
                    width={80}
                    height={45}
                />
            </Thumb>
            <Info>
                <Title isCurrent={isCurrent}>{episode.title}</Title>
                <Meta>
                    <span>EP.{episode.episodeNumber}</span>
                    {episode.duration != null && (
                        <>
                            <Dot />
                            <span>{formatDuration(episode.duration)}</span>
                        </>
                    )}
                </Meta>
            </Info>
        </Item>
    )
}

export default EpisodeListItem

const Item = styled.div<{ isCurrent: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
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

const Thumb = styled.div<{ isCurrent: boolean }>`
    flex-shrink: 0;
    width: 80px;
    aspect-ratio: 16 / 9;
    border-radius: 4px;
    background: ${({ isCurrent }) =>
        isCurrent ? 'rgba(180, 115, 249, 0.3)' : themedPalette.bg_element3};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`

const Info = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
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

const Meta = styled.div`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: ${themedPalette.text4};
`

const Dot = styled.span`
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: ${themedPalette.text4};
`
