import { useState } from 'react'
import AnimeCardTrack from '@components/home/AnimeCardTrack'
import AnimeTrackLayout from '@components/home/AnimeTrackLayout'
import AnimeCardTrackContainer from '@containers/home/AnimeCardTrackContainer'
import RankingTypeTag from '@components/home/RankingTypeTag'
import { useAnimationRankings } from '@libs/apis/animations'
import { RankingType } from '@libs/apis/animations/type'

const RankingAnimeContainer = () => {
    const [selectedType, setSelectedType] = useState<RankingType>('REALTIME')
    const { data, isLoading, isError } = useAnimationRankings(selectedType)

    const animeList = (data ?? []).map(
        ({ averageScore: _avg, reviewCount: _rc, ...rest }) => rest,
    )

    return (
        <AnimeTrackLayout
            title={'라애니 인기 애니'}
            option={
                <RankingTypeTag
                    selectedType={selectedType}
                    onTypeClick={setSelectedType}
                />
            }
        >
            <AnimeCardTrackContainer length={Math.floor(animeList.length * 5)}>
                <AnimeCardTrack
                    isLoading={isLoading}
                    anime={animeList}
                    isError={isError}
                />
            </AnimeCardTrackContainer>
        </AnimeTrackLayout>
    )
}

export default RankingAnimeContainer
