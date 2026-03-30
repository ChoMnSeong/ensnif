import styled from '@emotion/styled'
import Header from '@components/header/Header'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '@components/footer/Footer'
import useScrollToTop from '@hooks/useScrollToTop'
import FloatingHeader from '@components/header/FloatingHeader'
import Flex from '@components/common/Flex'

const DefaultLayout: React.FC = () => {
    const { pathname } = useLocation()
    const isPlayerPage = pathname.includes('player')

    useScrollToTop()

    return (
        <Flex direction="column" width="100vw">
            <Flex direction="column" width="100%">
                <Header />
                <FloatingHeader />
                <Main isPlayerPage={isPlayerPage}>
                    <Outlet />
                </Main>
                <Footer />
            </Flex>
        </Flex>
    )
}

export default DefaultLayout

const Main = styled.main<{ isPlayerPage: boolean }>`
    width: 100%;
    height: auto;
    padding-top: ${({ isPlayerPage }) => (isPlayerPage ? '0' : '4rem')};
`
