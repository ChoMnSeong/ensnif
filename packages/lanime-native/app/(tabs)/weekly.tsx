import { ScrollView, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { Screen } from '@components/common/Screen'
import { AppHeader } from '@components/common/AppHeader'
import { Thumbnail } from '@components/common/Thumbnail'
import { Empty } from '@components/common/Empty'
import { useAllWeeklyAnimations } from '@libs/apis/animations'
import { weekKeys } from '@libs/constants/weeks'

export default function WeeklyPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const { data: weekly } = useAllWeeklyAnimations()

    return (
        <Screen>
            <AppHeader title={t('weekly.pageTitle')} />
            <View className="px-4 pt-4 pb-2">
                <Text className="text-fg-1 text-2xl font-bold">
                    {t('weekly.pageTitle')}
                </Text>
                <Text className="text-fg-3 text-xs mt-2">
                    {t('weekly.notice')}
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                {weekKeys.map((day) => {
                    const list = weekly?.[day] ?? []
                    return (
                        <View key={day} className="mb-5">
                            <Text className="text-fg-1 text-base font-semibold px-4 mb-2">
                                {t(`airDay.${day}`)}
                            </Text>
                            {list.length === 0 ? (
                                <View className="px-4">
                                    <Empty message={t('weekly.noData')} />
                                </View>
                            ) : (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        paddingHorizontal: 16,
                                    }}
                                >
                                    {list.map((item) => (
                                        <Thumbnail
                                            key={item.id}
                                            uri={item.thumbnailUrl}
                                            title={item.title}
                                            badge={item.type}
                                            onPress={() =>
                                                router.push(
                                                    `/player/${item.id}/first` as never,
                                                )
                                            }
                                        />
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    )
                })}
            </ScrollView>
        </Screen>
    )
}
