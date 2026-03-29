import Header from '@components/header/Header'
import SettingsContainer from '@containers/settings/SettingsContainer'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import useTheme from '@libs/hooks/useTheme'

const SettingsPage: React.FC = () => {
    const { theme, toggleTheme } = useTheme()

    return (
        <PageWrapper>
            <Header theme={theme} toggleTheme={toggleTheme} />
            <Content>
                <SettingsContainer />
            </Content>
        </PageWrapper>
    )
}


export default SettingsPage

const PageWrapper = styled.div`
    width: 100vw;
    min-height: 100vh;
    background-color: ${themedPalette.bg_page1};
    position: relative;
`

const Content = styled.div`
    padding-top: 4rem;
`
