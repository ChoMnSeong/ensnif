import { ScrollView, Pressable, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { RankingType } from '@libs/apis/animations/type'

const RANKING_TYPES: RankingType[] = [
    'REALTIME',
    'Q1',
    'Q2',
    'Q3',
    'Q4',
    'LAST_YEAR',
    'ALL',
]

interface Props {
    selected: RankingType
    onSelect: (type: RankingType) => void
}

export const RankingTypeTabs = ({ selected, onSelect }: Props) => {
    const { t } = useTranslation()
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
            {RANKING_TYPES.map((type) => {
                const active = selected === type
                return (
                    <Pressable
                        key={type}
                        onPress={() => onSelect(type)}
                        className={`px-3 h-8 rounded-full items-center justify-center border ${
                            active
                                ? 'bg-primary border-primary'
                                : 'bg-transparent border-border-2'
                        }`}
                    >
                        <Text
                            className={
                                active
                                    ? 'text-white text-xs font-semibold'
                                    : 'text-fg-2 text-xs'
                            }
                        >
                            {t(`rankingType.${type}`)}
                        </Text>
                    </Pressable>
                )
            })}
        </ScrollView>
    )
}
