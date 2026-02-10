import styled from '@emotion/styled'
import useTab from '../../components/home/hook/useTab'
import { tabs } from '../../libs/constants/tabs'
import AnimeEpisodeTrack from '../../components/home/AnimeEpisodeTrack'
import { useSelector } from 'react-redux'
import { RootState } from '../../stores'
import AnimationReview from './AnimationReview'
import { themedPalette } from '../../libs/style/theme'

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
            isLoading={false}
            animationId={animationId!}
            handleEpisodeClick={onClose}
            data={['']}
        />,
        <AnimationReview
            animationId={animationId!}
            scrollContainerRef={scrollContainerRef} // ✅ 전달
        />,
    ])

    return (
        <Container>
            <Card>
                <TabWrapper>
                    {tabs.map((el, index) => (
                        <TabButton
                            key={el}
                            active={currentIndex === index}
                            onClick={() => setCurrentTab(index)}
                        >
                            {el}
                        </TabButton>
                    ))}
                </TabWrapper>
                <TabContent>{currentTab}</TabContent>
            </Card>
        </Container>
    )
}

export default AnimeEpisodeModalTab

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center
`

const Card = styled.div`
    width: 100%;
    padding: 0 8rem;
`

const TabWrapper = styled.div`
    display: flex;
    justify-content: space-between;
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
    text-align: center;
    padding: 16px 0;
    border-radius: 8px;
`
