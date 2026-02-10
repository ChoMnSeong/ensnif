import React from 'react'
import { useAnimeCardTrack } from '../../components/home/hook/useTrackMove'
import AnimeCardTrackLayout from '../../components/home/AnimeCardTrackLayout'

interface AnimeCardTrackContainerProps {
    children: React.ReactNode
    length: number
}

const AnimeCardTrackContainer: React.FC<AnimeCardTrackContainerProps> = ({
    children,
    length,
}) => {
    const { state, onNext, onPrev, hasPrev, hasNext } =
        useAnimeCardTrack(length)

    return (
        <AnimeCardTrackLayout
            state={state}
            hasPrev={hasPrev}
            hasNext={hasNext}
            onNext={onNext}
            onPrev={onPrev}
        >
            {children}
        </AnimeCardTrackLayout>
    )
}

export default AnimeCardTrackContainer
