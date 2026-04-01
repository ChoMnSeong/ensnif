import { useState, useEffect } from 'react'
import { useAllWeeklyAnimations } from '@libs/apis/animations'
import WeeklyAnimeGrid from '@components/home/WeeklyAnimeGrid'
import Text from '@components/common/Text'
import Flex from '@components/common/Flex'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'

const WeeklyAnimePageContainer = () => {
    const { data, isLoading } = useAllWeeklyAnimations()
    const [todayIndex, setTodayIndex] = useState(-1)

    useEffect(() => {
        setTodayIndex((new Date().getDay() + 6) % 7)
    }, [])

    return (
        <Flex direction="column" gap="2rem" padding="2.5rem 2rem 4rem">
            <Flex direction="column" gap="0.75rem">
                <Text sz="lgTl" color={themedPalette.text1} weight={700}>
                    요일별 신작
                </Text>
                <Notice sz="smCt" color={themedPalette.text4}>
                    * 서비스 원활한 방영 일정이 다를 수 있습니다. 실제 방영
                    일정은 각 방송국 홈페이지를 확인해 주시기 바랍니다.
                </Notice>
            </Flex>

            <WeeklyAnimeGrid
                data={data}
                isLoading={isLoading}
                todayIndex={todayIndex}
            />
        </Flex>
    )
}

export default WeeklyAnimePageContainer

const Notice = styled(Text)`
    line-height: 1.6;
`
