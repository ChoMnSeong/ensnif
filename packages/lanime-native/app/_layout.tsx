import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import Toast from 'react-native-toast-message'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { AppProviders } from '@components/providers/AppProviders'
import { AnimeEpisodeModal } from '@components/home/AnimeEpisodeModal'
import { useMyProfileQuery } from '@libs/apis/auth'
import { setUserProfile } from '@stores/auth'
import { useAppSelector } from '@libs/hooks/useAppDispatch'
import tokenStorage from '@libs/tokenStorage'
import '../global.css'

const RootBootstrap = () => {
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const profileId = useAppSelector((s) => s.userProfile.profileId)
    const hasProfileToken = !!tokenStorage.get.profileToken()

    const { data: myProfile } = useMyProfileQuery({
        enabled: hasProfileToken && !profileId,
    })

    useEffect(() => {
        if (!myProfile) return
        dispatch(
            setUserProfile({
                nickname: myProfile.name,
                avatarUrl: myProfile.avatarUrl,
                profileId: myProfile.profileId,
                age: null,
            }),
        )
        queryClient.invalidateQueries({ queryKey: ['weeklyAnimationList'] })
        queryClient.invalidateQueries({ queryKey: ['searchAnimations'] })
        queryClient.invalidateQueries({ queryKey: ['animationRankings'] })
        queryClient.invalidateQueries({ queryKey: ['similarAnimations'] })
    }, [myProfile, dispatch, queryClient])

    return null
}

export default function RootLayout() {
    return (
        <AppProviders>
            <RootBootstrap />
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#1A1A1A' },
                }}
            >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="profile" />
                <Stack.Screen
                    name="player/[animeId]/[videoId]"
                    options={{
                        animation: 'fade',
                        orientation: 'all',
                    }}
                />
                <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
                <Stack.Screen name="+not-found" />
            </Stack>
            <AnimeEpisodeModal />
            <Toast />
        </AppProviders>
    )
}
