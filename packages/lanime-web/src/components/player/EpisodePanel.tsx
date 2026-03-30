import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'

interface EpisodePanelProps {
    children: React.ReactNode
}

const EpisodePanel: React.FC<EpisodePanelProps> = ({ children }) => {
    return (
        <Panel direction="column">
            <PanelTitle>에피소드 목록</PanelTitle>
            <Scroll>{children}</Scroll>
        </Panel>
    )
}

export default EpisodePanel

const Panel = styled(Flex)`
    flex: 0 0 20%;
    background: ${themedPalette.bg_element1};
    border: 1px solid ${themedPalette.border2};
    border-radius: 6px;
    overflow: hidden;
    min-height: 0;

    @media (max-width: 900px) {
        flex: 1 1 auto;
        width: 100%;
        max-height: 360px;
    }
`

const PanelTitle = styled.div`
    flex-shrink: 0;
    padding: 1rem 1.25rem;
    font-size: 0.9rem;
    font-weight: 700;
    color: ${themedPalette.text1};
    border-bottom: 1px solid ${themedPalette.border2};
    background: ${themedPalette.bg_element1};
`

const Scroll = styled.div`
    flex: 1;
    overflow-y: auto;
    min-height: 0;

    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: ${themedPalette.border2};
        border-radius: 4px;
    }
`
