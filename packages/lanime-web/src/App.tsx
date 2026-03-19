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

const PlayerPage = loadable(() => import('./pages/PlayerPage'))

const App: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const hasAccessToken = !!customCookie.get.accessToken()
        const hasProfileToken = !!customCookie.get.profileToken()

        // 현재 경로가 '/auth'인지 확인 (하위 경로까지 포함하려면 startsWith 사용)
        const isAuthPage = location.pathname.startsWith('/auth')

        // accessToken은 있고 profileToken은 없으며, 현재 페이지가 auth가 아닐 때만 이동
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
