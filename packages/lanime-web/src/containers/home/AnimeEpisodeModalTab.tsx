import styled from '@emotion/styled'
import useTab from '@components/home/hook/useTab'
import { tabs } from '@libs/constants/tabs'
import AnimeEpisodeTrack from '@components/home/AnimeEpisodeTrack'
import { useSelector } from 'react-redux'
import { RootState } from '@stores/index'
import AnimationReview from '@containers/home/AnimationReview'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'

interface AnimeEpisodeModalTabProps {
    onClose: () => void
    scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

const AnimeEpisodeModalTab: React.FC<AnimeEpisodeModalTabProps> = ({
    onClose,
    scrollContainerRef,
}) => {
    const { animationId } = useSelector(
        (state: RootState) => state.episodeModal,
    )

    const [currentIndex, currentTab, setCurrentTab] = useTab(0, [
        <AnimeEpisodeTrack
            animationId={animationId!}
            handleEpisodeClick={onClose}
        />,
        <AnimationReview
            animationId={animationId!}
            scrollContainerRef={scrollContainerRef}
        />,
    ])

    return (
        <Flex direction="column" width="100%">
            <Card>
                <Flex justify="flex-start" gap="4rem">
                    {tabs.map((el, index) => (
                        <TabButton
                            key={el}
                            active={currentIndex === index}
                            onClick={() => setCurrentTab(index)}
                        >
                            {el}
                        </TabButton>
                    ))}
                </Flex>
                <TabContent>{currentTab}</TabContent>
            </Card>
        </Flex>
    )
}

export default AnimeEpisodeModalTab

const Card = styled.div`
    width: 100%;
    padding: 0 2rem;

    @media (max-width: 480px) {
        padding: 0 0.75rem;
    }
`

const TabButton = styled.button<{ active: boolean }>`
    background: none;
    color: ${({ active }) =>
        active ? themedPalette.primary1 : themedPalette.button_text};
    padding: 1rem 0;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s;
`

const TabContent = styled.div`
    font-size: 16px;
    padding: 16px 0;
    border-radius: 8px;
`
