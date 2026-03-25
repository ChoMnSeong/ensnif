import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import GlobalStyles from './libs/style/GlobalStyles'
import { Global } from '@emotion/react'
import DefaultLayout from './libs/layouts/DefaultLayout'
import AnimeEpisodeModal from './containers/home/AnimeEpisodeModal'
import React, { useEffect } from 'react'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import loadable from '@loadable/component'
import MailPage from './pages/MailPage'
import SignUpPage from './pages/SignUpPage'
import customCookie from './libs/customCookie'
import ProfilePage from './pages/ProfilePage'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './stores'
import { setUserProfile } from './stores/auth/reducer'
import { useMyProfileQuery } from './libs/apis/auth'

const PlayerPage = loadable(() => import('./pages/PlayerPage'))

const App: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const profileId = useSelector((state: RootState) => state.userProfile.profileId)

    const hasProfileToken = !!customCookie.get.profileToken()

    // 새로고침 시 Redux 상태 복구: profileToken은 있지만 Redux가 비어있는 경우에만 호출
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
            }),
        )
    }, [myProfile, dispatch])

    useEffect(() => {
        const hasAccessToken = !!customCookie.get.accessToken()

        const isAuthPage = location.pathname.startsWith('/auth')

        if (hasAccessToken && !hasProfileToken && !isAuthPage) {
            navigate('/profile')
        }
    }, [navigate, location.pathname])

    return (
        <>
            <Global styles={GlobalStyles} />

            <Routes>
                <Route element={<DefaultLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/player/:animeId/:videoId"
                        element={<PlayerPage />}
                    />
                </Route>

                <Route path="/auth/mail" element={<MailPage />} />
                <Route path="/auth/signup" element={<SignUpPage />} />

                <Route path="/profile" element={<ProfilePage />} />

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
