import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import Flex from '../components/common/Flex'
import HeaderLogo from '../components/header/HeaderLogo'
import ProfileContainer from '../containers/auth/ProfileContainer'
import { themedPalette } from '../libs/style/theme'

const ProfilePage: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark')

    useEffect(() => {
        const savedTheme =
            (localStorage.getItem('theme') as 'light' | 'dark') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light')
        setTheme(savedTheme)
        document.body.setAttribute('data-theme', savedTheme)
    }, [])

    return (
        <PageWrapper
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <LogoWrapper>
                <HeaderLogo theme={theme} />
            </LogoWrapper>
            <ProfileContainer />
        </PageWrapper>
    )
}

export default ProfilePage

const PageWrapper = styled(Flex)`
    width: 100vw;
    height: 100vh;
    background-color: ${themedPalette.bg_page1};
    position: relative;
`
const LogoWrapper = styled.div`
    position: absolute;
    top: 32px;
    left: 40px;
`
