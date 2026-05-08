import { useEffect, useState } from 'react'
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import {
    useAnimationGenres,
    useAnimationTypes,
} from '@libs/apis/animations'
import { SearchParams } from '@libs/apis/animations/type'

const STATUSES = ['UPCOMING', 'ONGOING', 'FINISHED'] as const

interface Props {
    visible: boolean
    initial: SearchParams
    onClose: () => void
    onApply: (params: SearchParams) => void
}

const Chip = ({
    active,
    children,
    onPress,
}: {
    active: boolean
    children: React.ReactNode
    onPress: () => void
}) => (
    <Pressable
        onPress={onPress}
        className={`px-3 h-8 rounded-full items-center justify-center border ${
            active
                ? 'bg-primary border-primary'
                : 'bg-bg-el2 border-border-2'
        }`}
    >
        <Text
            className={
                active
                    ? 'text-white text-xs font-semibold'
                    : 'text-fg-2 text-xs'
            }
        >
            {children}
        </Text>
    </Pressable>
)

export const SearchFilterModal = ({
    visible,
    initial,
    onClose,
    onApply,
}: Props) => {
    const { t } = useTranslation()
    const { data: genres } = useAnimationGenres()
    const { data: types } = useAnimationTypes()

    const [genreIds, setGenreIds] = useState<string[]>([])
    const [typeIds, setTypeIds] = useState<string[]>([])
    const [statuses, setStatuses] = useState<string[]>([])
    const [startYear, setStartYear] = useState('')
    const [endYear, setEndYear] = useState('')

    useEffect(() => {
        if (!visible) return
        setGenreIds(initial.genreIds ?? [])
        setTypeIds(initial.typeIds ?? [])
        setStatuses(initial.statuses ?? [])
        setStartYear(initial.startYear ? String(initial.startYear) : '')
        setEndYear(initial.endYear ? String(initial.endYear) : '')
    }, [visible, initial])

    const toggle = (
        list: string[],
        setList: (v: string[]) => void,
        id: string,
    ) => {
        if (list.includes(id)) setList(list.filter((x) => x !== id))
        else setList([...list, id])
    }

    const apply = () => {
        onApply({
            ...initial,
            genreIds: genreIds.length ? genreIds : undefined,
            typeIds: typeIds.length ? typeIds : undefined,
            statuses: statuses.length ? statuses : undefined,
            startYear: startYear ? Number(startYear) : undefined,
            endYear: endYear ? Number(endYear) : undefined,
        })
        onClose()
    }

    const reset = () => {
        setGenreIds([])
        setTypeIds([])
        setStatuses([])
        setStartYear('')
        setEndYear('')
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-bg-page">
                <View className="flex-row items-center justify-between px-4 h-14 border-b border-border-1">
                    <Pressable onPress={onClose} hitSlop={8}>
                        <Ionicons name="close" size={24} color="#FAFAF8" />
                    </Pressable>
                    <Text className="text-fg-1 font-semibold">
                        {t('search.title')}
                    </Text>
                    <Pressable onPress={reset} hitSlop={8}>
                        <Text className="text-primary text-sm">Reset</Text>
                    </Pressable>
                </View>

                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
                    <Text className="text-fg-1 font-semibold mb-2">
                        {t('search.genre')}
                    </Text>
                    <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                        {(genres ?? []).map((g) => (
                            <Chip
                                key={g.genreId}
                                active={genreIds.includes(g.genreId)}
                                onPress={() =>
                                    toggle(genreIds, setGenreIds, g.genreId)
                                }
                            >
                                {t(`genre.${g.name}`, g.name)}
                            </Chip>
                        ))}
                    </View>

                    <Text className="text-fg-1 font-semibold mt-6 mb-2">
                        {t('search.type')}
                    </Text>
                    <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                        {(types ?? []).map((tp) => (
                            <Chip
                                key={tp.typeId}
                                active={typeIds.includes(tp.typeId)}
                                onPress={() =>
                                    toggle(typeIds, setTypeIds, tp.typeId)
                                }
                            >
                                {t(`animationType.${tp.name}`, tp.name)}
                            </Chip>
                        ))}
                    </View>

                    <Text className="text-fg-1 font-semibold mt-6 mb-2">
                        {t('search.status')}
                    </Text>
                    <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                        {STATUSES.map((s) => (
                            <Chip
                                key={s}
                                active={statuses.includes(s)}
                                onPress={() => toggle(statuses, setStatuses, s)}
                            >
                                {t(`animationStatus.${s}`)}
                            </Chip>
                        ))}
                    </View>

                    <Text className="text-fg-1 font-semibold mt-6 mb-2">
                        {t('search.period')}
                    </Text>
                    <View className="flex-row" style={{ gap: 8 }}>
                        <View className="flex-1">
                            <Input
                                label={t('search.startYear')}
                                placeholder="2000"
                                keyboardType="number-pad"
                                value={startYear}
                                onChangeText={setStartYear}
                                maxLength={4}
                            />
                        </View>
                        <View className="flex-1">
                            <Input
                                label={t('search.endYear')}
                                placeholder="2026"
                                keyboardType="number-pad"
                                value={endYear}
                                onChangeText={setEndYear}
                                maxLength={4}
                            />
                        </View>
                    </View>
                </ScrollView>

                <View className="px-4 py-3 border-t border-border-1">
                    <Button onPress={apply}>{t('common.save')}</Button>
                </View>
            </View>
        </Modal>
    )
}
