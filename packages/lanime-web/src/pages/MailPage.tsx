import React from 'react'
import styled from '@emotion/styled'
import Flex from '@components/common/Flex'
import HeaderLogo from '@components/header/HeaderLogo'
import MailContainer from '@containers/auth/MailContainer'
import { themedPalette } from '@libs/style/theme'
import useTheme from '@hooks/useTheme'

const MailPage: React.FC = () => {
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
            <MailContainer />
        </PageWrapper>
    )
}

export default MailPage

const PageWrapper = styled(Flex)`
    width: 100vw;
    height: 100vh;
    background-color: ${themedPalette.bg_page1};
`
const LogoWrapper = styled.div`
    margin-bottom: 2rem;
`
