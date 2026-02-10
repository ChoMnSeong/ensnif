import styled from '@emotion/styled'
import Skeleton from '../common/Skeleton'

const AnimeCardSkeleton = () => {
    return (
        <AnimeCardSkeletonBlock>
            <Skeleton wt="100%" ht={'65%'} />
            <AnimeCardSkeletonContentBlock>
                <Skeleton wt="100%" ht={'55%'} margin="0.25rem 0 0 0" />
                <Skeleton wt="60%" ht={'45%'} margin="0.1em 0 0 0" />
            </AnimeCardSkeletonContentBlock>
        </AnimeCardSkeletonBlock>
    )
}

export default AnimeCardSkeleton

const AnimeCardSkeletonBlock = styled.ol`
    gap: 3%;
    flex: 0 0 18.625em;
    width: 18.625em;
    scroll-snap-align: start;
    position: relative;
    min-height: 14em;
    cursor: pointer;
`

const AnimeCardSkeletonContentBlock = styled.div`
    height: 35%;
`
