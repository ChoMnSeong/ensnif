import Tag from '@components/common/Tag'
import Flex from '@components/common/Flex'
import styled from '@emotion/styled'
import { RankingType } from '@libs/apis/animations/type'
import { useTranslation } from 'react-i18next'

const RANKING_TYPES: RankingType[] = ['REALTIME', 'Q1', 'Q2', 'Q3', 'Q4', 'LAST_YEAR', 'ALL']

interface RankingTypeTagProps {
    selectedType: RankingType
    onTypeClick: (type: RankingType) => void
}

const RankingTypeTag: React.FC<RankingTypeTagProps> = ({ selectedType, onTypeClick }) => {
    const { t } = useTranslation()

    return (
        <TabRow
            justify="flex-start"
            padding="0 0 1.5em 0"
            gap="0.75rem"
            wrap="wrap"
        >
            {RANKING_TYPES.map((type) => (
                <Tag
                    key={type}
                    variant="primary"
                    shape="pill"
                    size="md"
                    active={selectedType === type}
                    onClick={() => onTypeClick(type)}
                >
                    {t(`rankingType.${type}`)}
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
