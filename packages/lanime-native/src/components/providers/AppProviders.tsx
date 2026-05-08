import { useEffect, useState, ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { View } from 'react-native'
import { store } from '@stores'
import { queryClient } from '@libs/apis/queryClient'
import { hydrateTokenStorage } from '@libs/tokenStorage'
import i18n, { hydrateLanguage } from '@libs/i18n'
import '@libs/i18n'

interface Props {
    children: ReactNode
}

export const AppProviders = ({ children }: Props) => {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        let cancelled = false
        const bootstrap = async () => {
            await Promise.all([hydrateTokenStorage(), hydrateLanguage()])
            if (!cancelled) setReady(true)
        }
        bootstrap()
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        const handler = () => queryClient.invalidateQueries()
        i18n.on('languageChanged', handler)
        return () => {
            i18n.off('languageChanged', handler)
        }
    }, [])

    if (!ready) return null

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ReduxProvider store={store}>
                    <QueryClientProvider client={queryClient}>
                        <View style={{ flex: 1 }}>{children}</View>
                    </QueryClientProvider>
                </ReduxProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}
