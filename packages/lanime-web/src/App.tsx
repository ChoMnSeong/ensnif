import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import GlobalStyles from '@libs/style/GlobalStyles'
import { Global } from '@emotion/react'
import DefaultLayout from '@libs/layouts/DefaultLayout'
import React, { useEffect } from 'react'
import HomePage from '@pages/HomePage'
import NotFoundPage from '@pages/NotFoundPage'
import loadable from '@loadable/component'
import customCookie from '@libs/customCookie'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@stores/index'
import { setUserProfile } from '@stores/auth/reducer'
import { useMyProfileQuery } from '@libs/apis/auth'
import { useQueryClient } from '@tanstack/react-query'
import i18n from '@libs/i18n'

const PlayerPage = loadable(() => import('./pages/PlayerPage'))
const MailPage = loadable(() => import('./pages/MailPage'))
const SignUpPage = loadable(() => import('./pages/SignUpPage'))
const ProfilePage = loadable(() => import('./pages/ProfilePage'))
const SettingsPage = loadable(() => import('./pages/SettingsPage'))
const ForgotPasswordPage = loadable(() => import('./pages/ForgotPasswordPage'))
const ResetPinPage = loadable(() => import('./pages/ResetPinPage'))
const WeeklyPage = loadable(() => import('./pages/WeeklyPage'))
const SearchPage = loadable(() => import('./pages/SearchPage'))
const LibraryPage = loadable(() => import('./pages/LibraryPage'))
const AnimeEpisodeModal = loadable(() => import('@containers/home/AnimeEpisodeModal'))

const App: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const profileId = useSelector(
        (state: RootState) => state.userProfile.profileId,
    )

    const hasProfileToken = !!customCookie.get.profileToken()

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
                age: myProfile.age ?? null,
            }),
        )
        // userAge 변경 시 애니메이션 쿼리 무효화
        queryClient.invalidateQueries({
            queryKey: ['weeklyAnimationList'],
        })
        queryClient.invalidateQueries({
            queryKey: ['searchAnimations'],
        })
        queryClient.invalidateQueries({
            queryKey: ['animationRankings'],
        })
        queryClient.invalidateQueries({
            queryKey: ['similarAnimations'],
        })
    }, [myProfile, dispatch, queryClient])

    useEffect(() => {
        const hasAccessToken = !!customCookie.get.accessToken()

        const isAuthPage = location.pathname.startsWith('/auth')

        if (hasAccessToken && isAuthPage) {
            navigate('/profile')
        }
    }, [navigate, location.pathname, hasProfileToken])

    useEffect(() => {
        const handleLanguageChange = () => {
            queryClient.invalidateQueries()
        }

        i18n.on('languageChanged', handleLanguageChange)

        return () => {
            i18n.off('languageChanged', handleLanguageChange)
        }
    }, [queryClient])

    return (
        <>
            <Global styles={GlobalStyles} />

            <Routes>
                <Route element={<DefaultLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/weekly" element={<WeeklyPage />} />
                    <Route path="/library" element={<LibraryPage />} />
                    <Route
                        path="/player/:animeId/:videoId"
                        element={<PlayerPage />}
                    />
                </Route>

                <Route path="/auth/mail" element={<MailPage />} />
                <Route path="/auth/signup" element={<SignUpPage />} />
                <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/reset-pin" element={<ResetPinPage />} />
                <Route path="/settings" element={<SettingsPage />} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toaster
                position="top-center"
                richColors
                closeButton
                expand={false}
            />
            <AnimeEpisodeModal />
        </>
    )
}

export default App
