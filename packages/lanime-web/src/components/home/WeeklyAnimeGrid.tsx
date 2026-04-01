import React from 'react'
import styled from '@emotion/styled'
import AnimeCard from '@components/home/AnimeCard'
import AnimeCardSkeleton from '@components/home/AnimeCardSkeleton'
import Text from '@components/common/Text'
import Flex from '@components/common/Flex'
import { themedPalette } from '@libs/style/theme'
import { WeeklyAnimationResponse } from '@libs/apis/animations/type'

const DAY_LABELS = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']
const AIR_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const SKELETON_COUNT = 4

interface WeeklyAnimeGridProps {
    data?: WeeklyAnimationResponse
    isLoading: boolean
    todayIndex: number
}

const WeeklyAnimeGrid: React.FC<WeeklyAnimeGridProps> = ({ data, isLoading, todayIndex }) => {
    return (
        <DayGrid>
            {DAY_LABELS.map((label, dayIndex) => {
                const airDay = AIR_DAYS[dayIndex]
                const dayData = data?.[airDay] ?? []
                const isToday = dayIndex === todayIndex

                return (
                    <DayColumn key={label} direction="column" gap="0.75rem">
                        <DayHeader align="center" justify="center" isToday={isToday}>
                            <Text
                                sz="smCt"
                                color={isToday ? themedPalette.primary1 : themedPalette.text2}
                                weight={isToday ? 700 : 500}
                            >
                                {label}
                            </Text>
                        </DayHeader>

                        <CardList as="ol" direction="column" gap="1rem">
                            {isLoading
                                ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                                      <AnimeCardSkeleton key={i} />
                                  ))
                                : dayData.length === 0
                                  ? (
                                      <Flex align="center" justify="center" padding="2rem 0">
                                          <Text sz="smCt" color={themedPalette.text4}>
                                              없음
                                          </Text>
                                      </Flex>
                                    )
                                  : dayData.map((item) => (
                                        <AnimeCard key={item.id} {...item} disableHover />
                                    ))}
                        </CardList>
                    </DayColumn>
                )
            })}
        </DayGrid>
    )
}

export default WeeklyAnimeGrid

const DayGrid = styled.div`
    --card-w: 100%;

    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0 0.75rem;
    width: 100%;
    align-items: start;

    @media (max-width: 1279px) {
        gap: 0 0.5rem;
    }

    @media (max-width: 1023px) {
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem 0.75rem;
    }

    @media (max-width: 767px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem 0.75rem;
    }
`

const DayColumn = styled(Flex)``

const DayHeader = styled(Flex)<{ isToday: boolean }>`
    padding: 0.5rem 0;
    border-bottom: 2px solid
        ${({ isToday }) => (isToday ? themedPalette.primary1 : themedPalette.border2)};
`

const CardList = styled(Flex)`
    list-style: none;
    padding: 0;
    margin: 0;
`
