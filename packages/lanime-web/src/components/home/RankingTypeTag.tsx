import Tag from '@components/common/Tag'
import Flex from '@components/common/Flex'
import styled from '@emotion/styled'
import { RankingType } from '@libs/apis/animations/type'

const RANKING_TABS: { type: RankingType; label: string }[] = [
    { type: 'REALTIME', label: '실시간' },
    { type: 'Q1', label: '1분기' },
    { type: 'Q2', label: '2분기' },
    { type: 'Q3', label: '3분기' },
    { type: 'Q4', label: '4분기' },
    { type: 'LAST_YEAR', label: '작년' },
    { type: 'ALL', label: '전체' },
]

interface RankingTypeTagProps {
    selectedType: RankingType
    onTypeClick: (type: RankingType) => void
}

const RankingTypeTag: React.FC<RankingTypeTagProps> = ({
    selectedType,
    onTypeClick,
}) => {
    return (
        <TabRow
            justify="flex-start"
            padding="0 0 1.5em 0"
            gap="0.75rem"
            wrap="wrap"
        >
            {RANKING_TABS.map(({ type, label }) => (
                <Tag
                    key={type}
                    variant="primary"
                    shape="pill"
                    size="md"
                    active={selectedType === type}
                    onClick={() => onTypeClick(type)}
                >
                    {label}
                </Tag>
            ))}
        </TabRow>
    )
}

export default RankingTypeTag

const TabRow = styled(Flex)`
    @media (max-width: 767px) {
        gap: 0.5rem;
    }
`
