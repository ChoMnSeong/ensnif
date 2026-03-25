import styled from '@emotion/styled'
import Header from '../../components/header/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/footer/Footer'
import useScrollToTop from '../hooks/useScrollToTop'
import FloatingHeader from '../../components/header/FloatingHeader'
import useTheme from '../hooks/useTheme'

const DefaultLayout: React.FC = () => {
    const { theme, toggleTheme } = useTheme()

    useScrollToTop()

    return (
        <Container>
            <Wrapper>
                <Header theme={theme} toggleTheme={toggleTheme} />
                <FloatingHeader theme={theme} toggleTheme={toggleTheme} />
                <Main>
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
    justify-content: center;
    width: 100%;
    height: 100%;
`

const Main = styled.div`
    width: 100%;
    height: auto;
    min-height: 100vh;
`
