import Flex from '@components/common/Flex'
import styled from '@emotion/styled'
import RankingAnimeContainer from '@containers/home/RankingAnimeContainer'
import SlideContainer from '@containers/home/SlideContainer'
import WeeklyNewAnimeContainer from '@containers/home/WeeklyNewAnimeContainer'
import { themedPalette } from '@libs/style/theme'

const HomePage = () => {
    return (
        <div style={{ overflowX: 'hidden' }}>
            <SlideContainer />

            <ThemedFlex direction="column" padding="2.5em 0 4em 0" gap="4em">
                <WeeklyNewAnimeContainer />
                <RankingAnimeContainer />
            </ThemedFlex>
        </div>
    )
}

export default HomePage

const ThemedFlex = styled(Flex)`
    background-color: ${themedPalette.bg_page1};
`
