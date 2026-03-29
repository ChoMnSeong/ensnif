import { weeks } from '@libs/constants/weeks'
import Tag from '@components/common/Tag'
import Flex from '@components/common/Flex'
import styled from '@emotion/styled'

interface WeeklyNewAnimeTagProps {
    currentDay: number
    onWeekTagClick: (e: number) => void
}

const WeeklyNewAnimeTag: React.FC<WeeklyNewAnimeTagProps> = ({
    currentDay,
    onWeekTagClick,
}) => {
    return (
        <DayTagRow justifyContent="flex-start" padding="0 0 1.5em 0">
            {weeks.map((el, index) => {
                const isToday =
                    index === (currentDay === 0 ? 6 : currentDay - 1)
                return (
                    <Tag
                        key={el}
                        shape="circle"
                        variant="primary"
                        size="md"
                        active={isToday}
                        onClick={() => onWeekTagClick(index + 1)}
                    >
                        {el}
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
