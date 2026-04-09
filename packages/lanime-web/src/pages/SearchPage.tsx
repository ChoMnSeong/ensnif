import styled from '@emotion/styled'
import SearchContainer from '@containers/search/SearchContainer'
import { themedPalette } from '@libs/style/theme'

const SearchPage: React.FC = () => {
    return (
        <PageWrapper>
            <SearchContainer />
        </PageWrapper>
    )
}

export default SearchPage

const PageWrapper = styled.div`
    width: 100%;
    background: ${themedPalette.bg_page1};
`
