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
        <LayoutWrapper direction="column" width="100%">
            <Header />
            <FloatingHeader />
            <Main isPlayerPage={isPlayerPage}>
                <Outlet />
            </Main>
            <Footer />
        </LayoutWrapper>
    )
}

export default DefaultLayout

const LayoutWrapper = styled(Flex)`
    min-height: 100vh;
`

const Main = styled.main<{ isPlayerPage: boolean }>`
    width: 100%;
    flex: 1;
    padding-top: ${({ isPlayerPage }) => (isPlayerPage ? '0' : '4rem')};
`
