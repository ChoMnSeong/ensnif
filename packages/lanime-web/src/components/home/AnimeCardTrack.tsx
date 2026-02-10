import { Animation } from '../../libs/apis/animation/type'
import AnimeCard from './AnimeCard'
import AnimeCardSkeleton from './AnimeCardSkeleton'
import React from 'react'

interface AnimeCardTrackProps {
    isLoading: boolean
    isError: boolean
    anime: Animation[]
}

const AnimeCardTrack: React.FC<AnimeCardTrackProps> = ({
    isLoading,
    isError,
    anime,
}) => {
    return (
        <React.Fragment>
            {!isError &&
                !isLoading &&
                anime.map((e: Animation, index) => (
                    <AnimeCard key={index} {...e} />
                ))}
            {(isLoading || isError) &&
                Array.from({ length: 6 }).map((_, index) => (
                    <AnimeCardSkeleton key={index} />
                ))}
        </React.Fragment>
    )
}

export default AnimeCardTrack
