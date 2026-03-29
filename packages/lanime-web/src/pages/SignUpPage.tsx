import React from 'react'
import styled from '@emotion/styled'
import Flex from '@components/common/Flex'
import HeaderLogo from '@components/header/HeaderLogo'
import SignupContainer from '@containers/auth/SignupContainer'
import { themedPalette } from '@libs/style/theme'
import useTheme from '@hooks/useTheme'

const SignUpPage: React.FC = () => {
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
            <SignupContainer />
        </PageWrapper>
    )
}

export default SignUpPage

const PageWrapper = styled(Flex)`
    width: 100vw;
    height: 100vh;
    background-color: ${themedPalette.bg_page1};
`

const LogoWrapper = styled(Flex)`
    margin-bottom: 2rem;
`
