import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import AnimeTrackLayout from '@components/home/AnimeTrackLayout'
import AnimeCardTrackContainer from '@containers/home/AnimeCardTrackContainer'
import WatchHistoryCard from '@/components/library/WatchHistoryCard'
import { useWatchHistoryList } from '@libs/apis/library'
import customCookie from '@libs/customCookie'
import { useTranslation } from 'react-i18next'

const WatchHistoryHomeSection: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const hasProfileToken = !!customCookie.get.profileToken()

    const { data, isLoading } = useWatchHistoryList()

    if (!mounted || !hasProfileToken) return null

    const episodes =
        data?.pages.flatMap((page) => page.data?.episodes ?? []) ?? []

    if (!isLoading && episodes.length === 0) return null

    return (
        <AnimeTrackLayout title={t('home.continueWatching')}>
            <AnimeCardTrackContainer length={episodes.length}>
                <React.Fragment>
                    {episodes.map((episode) => (
                        <TrackItem
                            key={`${episode.episodeId}-${episode.watchedAt}`}
                        >
                            <WatchHistoryCard
                                episode={episode}
                                onClick={() =>
                                    navigate(
                                        `/player/${episode.animationId}/${episode.episodeId}`,
                                    )
                                }
                            />
                        </TrackItem>
                    ))}
                </React.Fragment>
            </AnimeCardTrackContainer>
        </AnimeTrackLayout>
    )
}

export default WatchHistoryHomeSection

const TrackItem = styled.li`
    flex: 0 0 var(--card-w);
    width: var(--card-w);
    list-style: none;
    scroll-snap-align: start;
`
