import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { palettes } from '@libs/style/theme'

const palette = palettes.dark

export default function TabsLayout() {
    const { t } = useTranslation()

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: palette.primary1,
                tabBarInactiveTintColor: palette.text3,
                tabBarStyle: {
                    backgroundColor: palette.bgPage1,
                    borderTopColor: palette.border1,
                    borderTopWidth: 0.5,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: t('nav.search', 'Search'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="search" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="weekly"
                options={{
                    title: t('nav.weekly', 'Weekly'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    title: t('library.title', 'Library'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="library" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}
