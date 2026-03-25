import AnimeCardTrack from '../../components/home/AnimeCardTrack'
import AnimeTrackLayout from '../../components/home/AnimeTrackLayout'
import { Animation } from '../../libs/apis/animations/type'
import AnimeCardTrackContainer from './AnimeCardTrackContainer'

const RankingAnimeContainer = () => {
    const data: Animation[] = []

    return (
        <AnimeTrackLayout title={'라애니 인기 애니'}>
            <AnimeCardTrackContainer length={data.length / 5}>
                <AnimeCardTrack isLoading={true} anime={data} isError={false} />
            </AnimeCardTrackContainer>
        </AnimeTrackLayout>
    )
}

export default RankingAnimeContainer
