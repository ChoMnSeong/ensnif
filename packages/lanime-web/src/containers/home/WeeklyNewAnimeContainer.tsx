import WeeklyNewAnimeTag from '@components/home/WeeklyNewAnimeTag'
import AnimeCardTrack from '@components/home/AnimeCardTrack'
import { useTranslation } from 'react-i18next'
import AnimeTrackLayout from '@components/home/AnimeTrackLayout'
import AnimeCardTrackContainer from '@containers/home/AnimeCardTrackContainer'
import { useWeeklyAnimationList } from '@libs/apis/animations'
import { useState } from 'react'

const WeeklyNewAnimeContainer = () => {
    const { t } = useTranslation()
    const airDays = [
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
    ]

    const [currentDay, setCurrentDay] = useState<number>(new Date().getDay() || 7)

    const { data, isLoading, isError } = useWeeklyAnimationList({
        airDay: airDays[currentDay - 1],
    })

    const onWeekTagClick = (e: number) => {
        setCurrentDay(e)
    }

    return (
        <AnimeTrackLayout
            title={t('home.weeklyAnime')}
            option={
                <WeeklyNewAnimeTag
                    currentDay={currentDay}
                    onWeekTagClick={onWeekTagClick}
                />
            }
        >
            <AnimeCardTrackContainer
                length={data?.length || 0}
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
