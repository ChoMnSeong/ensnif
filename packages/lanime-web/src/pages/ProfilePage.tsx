import React from 'react'
import styled from '@emotion/styled'
import Flex from '../components/common/Flex'
import HeaderLogo from '../components/header/HeaderLogo'
import ProfileContainer from '../containers/auth/ProfileContainer'
import { themedPalette } from '../libs/style/theme'
import useTheme from '../libs/hooks/useTheme'

const ProfilePage: React.FC = () => {
    const { theme } = useTheme()

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
