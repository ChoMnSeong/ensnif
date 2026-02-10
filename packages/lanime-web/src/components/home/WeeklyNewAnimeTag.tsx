import { weeks } from '../../libs/constants/weeks'
import CircleTag from '../common/CircleTag'
import Flex from '../common/Flex'

interface WeeklyNewAnimeTagProps {
    currentDay: number
    onWeekTagClick: (e: number) => void
}

const WeeklyNewAnimeTag: React.FC<WeeklyNewAnimeTagProps> = ({
    currentDay,
    onWeekTagClick,
}) => {
    return (
        <Flex gap="1rem" justifyContent="flex-start" padding="0 0 1.5em 0">
            {weeks.map((el, index) => {
                const isToday =
                    index === (currentDay === 0 ? 6 : currentDay - 1)
                return (
                    <CircleTag
                        key={el}
                        active={isToday}
                        onClick={() => onWeekTagClick(index + 1)}
                    >
                        {el}
                    </CircleTag>
                )
            })}
        </Flex>
    )
}

export default WeeklyNewAnimeTag
