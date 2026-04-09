import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { useWatchHistoryList } from '@libs/apis/library'
import WatchHistoryCard from '@/components/library/WatchHistoryCard'
import LibraryCardSkeleton from '@/components/library/LibraryCardSkeleton'
import Flex from '@components/common/Flex'
import { themedPalette } from '@libs/style/theme'
import { useTranslation } from 'react-i18next'

interface WatchHistoryContainerProps {
    active: boolean
}

const WatchHistoryContainer: React.FC<WatchHistoryContainerProps> = ({
    active,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useWatchHistoryList()

    const observerRef = useRef<IntersectionObserver | null>(null)
    const sentinelRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) observerRef.current.disconnect()
            if (!node) return
            observerRef.current = new IntersectionObserver((entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage()
                }
            })
            observerRef.current.observe(node)
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage],
    )

    const episodes =
        data?.pages.flatMap((page) => page.data?.episodes ?? []) ?? []

    if (!active) return null

    if (isLoading) {
        return (
            <Wrapper direction="column" gap="1rem">
                <Grid>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <LibraryCardSkeleton key={i} />
                    ))}
                </Grid>
            </Wrapper>
        )
    }

    if (episodes.length === 0) {
        return (
            <EmptyWrapper align="center" justify="center">
                <EmptyText>{t('library.emptyHistory')}</EmptyText>
            </EmptyWrapper>
        )
    }

    const total = data?.pages[0]?.data?.total ?? episodes.length

    return (
        <Wrapper direction="column" gap="1rem">
            <CountText>{t('library.count', { count: total })}</CountText>
            <Grid>
                {episodes.map((episode) => (
                    <WatchHistoryCard
                        key={`${episode.episodeId}-${episode.watchedAt}`}
                        episode={episode}
                        onClick={() =>
                            navigate(
                                `/player/${episode.animationId}/${episode.episodeId}`,
                            )
                        }
                    />
                ))}
                {isFetchingNextPage &&
                    Array.from({ length: 3 }).map((_, i) => (
                        <LibraryCardSkeleton key={`next-${i}`} />
                    ))}
            </Grid>
            <Sentinel ref={sentinelRef} />
        </Wrapper>
    )
}

export default WatchHistoryContainer

const Wrapper = styled(Flex)`
    width: 100%;
`

const CountText = styled.span`
    font-size: 0.875rem;
    color: ${themedPalette.text3};
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem 1rem;
    width: 100%;

    @media (max-width: 767px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem 0.75rem;
    }
`

const EmptyWrapper = styled(Flex)`
    width: 100%;
    min-height: 200px;
`

const EmptyText = styled.span`
    font-size: 1rem;
    color: ${themedPalette.text4};
`

const Sentinel = styled.div`
    height: 1px;
`
