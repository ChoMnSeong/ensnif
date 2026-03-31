import React from 'react'
import styled from '@emotion/styled'
import Flex from '@components/common/Flex'
import HeaderLogo from '@components/header/HeaderLogo'
import ResetPinContainer from '@containers/auth/ResetPinContainer'
import { themedPalette } from '@libs/style/theme'
import useTheme from '@hooks/useTheme'

const ResetPinPage: React.FC = () => {
    const { theme } = useTheme()

    return (
        <PageWrapper direction="column" align="center" justify="center">
            <LogoWrapper>
                <HeaderLogo theme={theme} />
            </LogoWrapper>
            <ResetPinContainer />
        </PageWrapper>
    )
}

export default ResetPinPage

const PageWrapper = styled(Flex)`
    width: 100vw;
    height: 100vh;
    background-color: ${themedPalette.bg_page1};
`

const LogoWrapper = styled.div`
    margin-bottom: 2rem;
`
