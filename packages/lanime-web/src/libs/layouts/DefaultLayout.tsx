import styled from '@emotion/styled'
import Header from '@components/header/Header'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '@components/footer/Footer'
import useScrollToTop from '@hooks/useScrollToTop'
import FloatingHeader from '@components/header/FloatingHeader'

const DefaultLayout: React.FC = () => {
    const { pathname } = useLocation()
    const isPlayerPage = pathname.includes('player')

    useScrollToTop()

    return (
        <Container>
            <Wrapper>
                <Header />
                <FloatingHeader />
                <Main isPlayerPage={isPlayerPage}>
                    <Outlet />
                </Main>
                <Footer />
            </Wrapper>
        </Container>
    )
}

export default DefaultLayout

const Container = styled.div`
    width: 100vw;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`

const Main = styled.main<{ isPlayerPage: boolean }>`
    width: 100%;
    height: auto;
    padding-top: ${({ isPlayerPage }) => (isPlayerPage ? '0' : '4rem')};
`
