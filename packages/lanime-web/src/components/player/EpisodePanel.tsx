import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'

import { useTranslation } from 'react-i18next'

interface EpisodePanelProps {
    children: React.ReactNode
}

const EpisodePanel: React.FC<EpisodePanelProps> = ({ children }) => {
    const { t } = useTranslation()
    return (
        <PanelSlot>
            <Panel direction="column">
                <PanelTitle>{t('player.episodeList')}</PanelTitle>
                <Scroll>{children}</Scroll>
            </Panel>
        </PanelSlot>
    )
}

export default EpisodePanel

// 에피소드가 많으면 목록 높이가 행 전체를 밀어올려 16:9 플레이어까지 같이
// 늘어났다. 자리(슬롯)만 행에 남기고 패널은 absolute로 덮어, 행 높이는
// 플레이어가 정하고 목록은 그 높이 안에서 스크롤되게 한다.
const PanelSlot = styled.div`
    position: relative;
    flex: 0 0 20%;
    align-self: stretch;
    /* 잘못된 videoId 등으로 플레이어가 없을 때 목록이 사라지지 않도록 */
    min-height: 200px;

    @media (max-width: 900px) {
        position: static;
        display: flex;
        flex: 1 1 auto;
        width: 100%;
        min-height: 0;
        max-height: 360px;
    }
`

const Panel = styled(Flex)`
    position: absolute;
    inset: 0;
    background: ${themedPalette.bg_element1};
    border: 1px solid ${themedPalette.border2};
    border-radius: 6px;
    overflow: hidden;
    min-height: 0;

    @media (max-width: 900px) {
        position: static;
        flex: 1 1 auto;
        width: 100%;
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
