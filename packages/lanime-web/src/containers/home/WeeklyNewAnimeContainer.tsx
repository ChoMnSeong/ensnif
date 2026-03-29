import WeeklyNewAnimeTag from '@components/home/WeeklyNewAnimeTag'
import AnimeCardTrack from '@components/home/AnimeCardTrack'
import AnimeTrackLayout from '@components/home/AnimeTrackLayout'
import AnimeCardTrackContainer from '@containers/home/AnimeCardTrackContainer'
import { useWeeklyAnimationList } from '@libs/apis/animations'
import { useState } from 'react'

const WeeklyNewAnimeContainer = () => {
    const airDays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ]

    const [currentDay, setCurrentDay] = useState<number>(new Date().getDay())

    const { data, isLoading, isError } = useWeeklyAnimationList({
        airDay: airDays[currentDay - 1],
    })

    const onWeekTagClick = (e: number) => {
        setCurrentDay(e)
    }

    return (
        <AnimeTrackLayout
            title={'요일별 신작 애니'}
            option={
                <WeeklyNewAnimeTag
                    currentDay={currentDay}
                    onWeekTagClick={onWeekTagClick}
                />
            }
        >
            <AnimeCardTrackContainer
                length={Math.floor((data?.length || 1) / 5)}
            >
                <AnimeCardTrack
                    isLoading={isLoading}
                    isError={isError}
                    anime={data || []}
                />
            </AnimeCardTrackContainer>
        </AnimeTrackLayout>
    )
}

export default WeeklyNewAnimeContainer
