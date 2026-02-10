import { useDispatch, useSelector } from 'react-redux'
import AnimeEpisodeModalLayout from '../../components/home/AnimeEpisodeModalLayout'
import AnimePreview from '../../components/home/AnimePreview'
import { RootState } from '../../stores'
import AnimeEpisodeModalTab from './AnimeEpisodeModalTab'
import { setModalVisibility } from '../../stores/episodeModal/reducer'
import { useAnimationDetail } from '../../libs/apis/animation'
import { useRef } from 'react'

const AnimeEpisodeModal: React.FC = () => {
    const dispatch = useDispatch()
    const { visible, animationId } = useSelector(
        (state: RootState) => state.episodeModal,
    )

    const handleEpisodeModalClose = () => {
        dispatch(setModalVisibility(false))
    }

    const { data } = useAnimationDetail(animationId!)

    const modalScrollRef = useRef<HTMLDivElement | null>(null)

    return (
        <AnimeEpisodeModalLayout
            ref={modalScrollRef} // ✅ 전달
            visible={visible}
            onClose={handleEpisodeModalClose}
        >
            {data && <AnimePreview animation={data} />}
            <AnimeEpisodeModalTab
                scrollContainerRef={modalScrollRef}
                onClose={handleEpisodeModalClose}
            />
        </AnimeEpisodeModalLayout>
    )
}

export default AnimeEpisodeModal
