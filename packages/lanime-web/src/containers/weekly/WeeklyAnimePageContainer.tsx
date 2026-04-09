import { useState, useEffect } from 'react'
import { useAllWeeklyAnimations } from '@libs/apis/animations'
import WeeklyAnimeGrid from '@components/weekly/WeeklyAnimeGrid'
import Text from '@components/common/Text'
import Flex from '@components/common/Flex'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'

import { useTranslation } from 'react-i18next'

const WeeklyAnimePageContainer = () => {
    const { t } = useTranslation()
    const { data, isLoading } = useAllWeeklyAnimations()
    const [todayIndex, setTodayIndex] = useState(-1)

    useEffect(() => {
        setTodayIndex((new Date().getDay() + 6) % 7)
    }, [])

    return (
        <Flex direction="column" gap="2rem" padding="2.5rem 2rem 4rem">
            <Flex direction="column" gap="0.75rem">
                <Text sz="lgTl" color={themedPalette.text1} weight={700}>
                    {t('weekly.pageTitle')}
                </Text>
                <Notice sz="smCt" color={themedPalette.text4}>
                    {t('weekly.notice')}
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
