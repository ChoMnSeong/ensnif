import styled from '@emotion/styled'
import Header from '../../components/header/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/footer/Footer'
import useScrollToTop from '../hooks/useScrollToTop'
import FloatingHeader from '../../components/header/FloatingHeader'
import { useEffect, useState } from 'react'

const DefaultLayout: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        const savedTheme =
            (localStorage.getItem('theme') as 'light' | 'dark') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light')
        setTheme(savedTheme)
        document.body.setAttribute('data-theme', savedTheme)
    }, [theme])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.body.setAttribute('data-theme', newTheme)
    }

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
