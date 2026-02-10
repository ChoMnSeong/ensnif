import { Route, Routes } from 'react-router-dom'
import GlobalStyles from './libs/style/GlobalStyles'
import { Global } from '@emotion/react'
import DefaultLayout from './libs/layouts/DefaultLayout'
import AnimeEpisodeModal from './containers/home/AnimeEpisodeModal'
import React from 'react'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import loadable from '@loadable/component'
import MailPage from './pages/MailPage'

const PlayerPage = loadable(() => import('./pages/PlayerPage'))

const App: React.FC = () => {
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

                <Route path="*" element={<NotFoundPage />} />
            </Routes>

            <AnimeEpisodeModal />
        </>
    )
}

export default App
