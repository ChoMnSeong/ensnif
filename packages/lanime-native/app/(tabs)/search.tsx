import { useMemo, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Image } from 'expo-image'
import { Screen } from '@components/common/Screen'
import { AppHeader } from '@components/common/AppHeader'
import { Empty } from '@components/common/Empty'
import { SearchFilterModal } from '@components/search/SearchFilterModal'
import { useInfiniteSearchAnimations } from '@libs/apis/animations'
import { SearchParams } from '@libs/apis/animations/type'
import { openModal } from '@stores/episodeModal'

export default function SearchPage() {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const [query, setQuery] = useState('')
    const [params, setParams] = useState<SearchParams>({})
    const [showFilter, setShowFilter] = useState(false)

    const finalParams = useMemo(
        () => ({ ...params, query: query.trim() || undefined }),
        [params, query],
    )

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteSearchAnimations(finalParams)

    const items = data?.pages.flatMap((p) => p.items) ?? []
    const hasFilters =
        (params.genreIds?.length ?? 0) +
            (params.typeIds?.length ?? 0) +
            (params.statuses?.length ?? 0) +
            (params.startYear ? 1 : 0) +
            (params.endYear ? 1 : 0) >
        0

    return (
        <Screen>
            <AppHeader title={t('search.title')} />
            <View className="px-4 pt-4 pb-3 flex-row items-center" style={{ gap: 8 }}>
                <View className="flex-1 flex-row items-center bg-bg-el2 rounded-xl px-3 h-12 border border-border-1">
                    <Ionicons name="search" size={18} color="#848484" />
                    <TextInput
                        className="flex-1 ml-2 text-fg-1"
                        placeholder={t('search.placeholder')}
                        placeholderTextColor="#848484"
                        value={query}
                        onChangeText={setQuery}
                        returnKeyType="search"
                    />
                    {query ? (
                        <Pressable onPress={() => setQuery('')} hitSlop={8}>
                            <Ionicons
                                name="close-circle"
                                size={18}
                                color="#848484"
                            />
                        </Pressable>
                    ) : null}
                </View>
                <Pressable
                    onPress={() => setShowFilter(true)}
                    className={`w-12 h-12 rounded-xl items-center justify-center border ${
                        hasFilters
                            ? 'bg-primary border-primary'
                            : 'bg-bg-el2 border-border-1'
                    }`}
                >
                    <Ionicons
                        name="options"
                        size={20}
                        color={hasFilters ? '#fff' : '#FAFAF8'}
                    />
                </Pressable>
            </View>

            <View className="px-4 pb-2">
                <Text className="text-fg-3 text-xs">
                    {t('search.resultCount', { count: items.length })}
                </Text>
            </View>

            {items.length === 0 && !isFetching ? (
                <Empty message={t('search.noResults')} />
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    contentContainerStyle={{
                        paddingHorizontal: 12,
                        paddingBottom: 24,
                    }}
                    columnWrapperStyle={{ gap: 8, marginBottom: 12 }}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => hasNextPage && fetchNextPage()}
                    renderItem={({ item }) => (
                        <Pressable
                            className="flex-1"
                            onPress={() =>
                                dispatch(
                                    openModal({
                                        animationId: item.id,
                                        title: item.title,
                                    }),
                                )
                            }
                        >
                            <View className="aspect-[2/3] rounded-lg overflow-hidden bg-bg-el2">
                                <Image
                                    source={{ uri: item.thumbnailUrl }}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="cover"
                                />
                            </View>
                            <Text
                                className="text-fg-1 text-xs mt-2"
                                numberOfLines={2}
                            >
                                {item.title}
                            </Text>
                        </Pressable>
                    )}
                    ListFooterComponent={
                        isFetchingNextPage ? (
                            <ActivityIndicator
                                color="#b473f9"
                                style={{ marginVertical: 16 }}
                            />
                        ) : null
                    }
                />
            )}

            <SearchFilterModal
                visible={showFilter}
                initial={params}
                onClose={() => setShowFilter(false)}
                onApply={setParams}
            />
        </Screen>
    )
}
