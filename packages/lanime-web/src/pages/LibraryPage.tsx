import { useState } from 'react'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { RootState } from '@stores/index'
import Image from '@components/common/Image'
import Flex from '@components/common/Flex'
import { themedPalette } from '@libs/style/theme'
import WatchHistoryContainer from '@containers/library/WatchHistoryContainer'
import FavoritesContainer from '@containers/library/FavoritesContainer'
import { useTranslation } from 'react-i18next'

type Tab = 'history' | 'likes'

const WatchHistoryPage: React.FC = () => {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState<Tab>('history')
    const profile = useSelector((state: RootState) => state.userProfile)

    return (
        <PageWrapper>
            <Inner gap="2.5rem" align="flex-start">
                <Sidebar direction="column" align="center" gap="1rem">
                    {profile.avatarUrl && (
                        <Image
                            src={profile.avatarUrl}
                            alt="profile"
                            width={80}
                            height={80}
                            borderRadius="50%"
                            border={`2px solid ${themedPalette.border2}`}
                        />
                    )}
                    {profile.nickname && (
                        <Nickname>{profile.nickname}</Nickname>
                    )}
                </Sidebar>

                <ContentArea direction="column" gap="1.5rem" flex={1}>
                    <SectionTitle>{t('library.title')}</SectionTitle>

                    <TabRow align="center" gap="0">
                        <TabButton
                            active={activeTab === 'history'}
                            onClick={() => setActiveTab('history')}
                        >
                            {t('library.watchHistory')}
                        </TabButton>
                        <TabButton
                            active={activeTab === 'likes'}
                            onClick={() => setActiveTab('likes')}
                        >
                            {t('library.likes')}
                        </TabButton>
                    </TabRow>

                    <WatchHistoryContainer active={activeTab === 'history'} />
                    <FavoritesContainer active={activeTab === 'likes'} />
                </ContentArea>
            </Inner>
        </PageWrapper>
    )
}

export default WatchHistoryPage

const PageWrapper = styled.div`
    width: 100%;
    background: ${themedPalette.bg_page1};
    padding: 3rem 0 4rem;
`

const Inner = styled(Flex)`
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;

    @media (max-width: 767px) {
        flex-direction: column;
        align-items: stretch;
        padding: 0 1rem;
        gap: 1.5rem;
    }
`

const Sidebar = styled(Flex)`
    width: 200px;
    flex-shrink: 0;
    padding-top: 0.5rem;

    @media (max-width: 767px) {
        width: 100%;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
        padding-top: 0;
    }
`

const Nickname = styled.span`
    font-size: 1.1rem;
    font-weight: 700;
    color: ${themedPalette.text1};
`

const ContentArea = styled(Flex)`
    min-width: 0;
`

const SectionTitle = styled.h1`
    font-size: 1.4rem;
    font-weight: 700;
    color: ${themedPalette.text1};
    margin: 0;
`

const TabRow = styled(Flex)`
    border-bottom: 1px solid ${themedPalette.border2};
`

const TabButton = styled.button<{ active: boolean }>`
    background: none;
    border: none;
    border-bottom: 2px solid ${({ active }) => (active ? themedPalette.primary1 : 'transparent')};
    margin-bottom: -1px;
    padding: 0.6rem 1.25rem;
    font-size: 0.95rem;
    font-weight: ${({ active }) => (active ? 700 : 500)};
    color: ${({ active }) => (active ? themedPalette.primary1 : themedPalette.text3)};
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;

    &:hover {
        color: ${themedPalette.text1};
    }
`

