import Tag from '@components/common/Tag'
import Flex from '@components/common/Flex'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'

const AIR_DAY_KEYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const

interface WeeklyNewAnimeTagProps {
    currentDay: number
    onWeekTagClick: (e: number) => void
}

const WeeklyNewAnimeTag: React.FC<WeeklyNewAnimeTagProps> = ({
    currentDay,
    onWeekTagClick,
}) => {
    const { t } = useTranslation()

    return (
        <DayTagRow justifyContent="flex-start" padding="0 0 1.5em 0">
            {AIR_DAY_KEYS.map((key, index) => {
                const isToday = index === (currentDay === 0 ? 6 : currentDay - 1)
                return (
                    <Tag
                        key={key}
                        shape="circle"
                        variant="primary"
                        size="md"
                        active={isToday}
                        onClick={() => onWeekTagClick(index + 1)}
                    >
                        {t(`airDayShort.${key}`)}
                    </Tag>
                )
            })}
        </DayTagRow>
    )
}

export default WeeklyNewAnimeTag

const DayTagRow = styled(Flex)`
    gap: 1rem;

    @media (max-width: 767px) {
        gap: 0.5rem;
    }
`
