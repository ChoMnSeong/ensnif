import styled from '@emotion/styled'
import Skeleton from '@components/common/Skeleton'

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

const AnimeCardSkeletonBlock = styled.li`
    list-style: none;
    gap: 3%;
    flex: 0 0 var(--card-w);
    width: var(--card-w);
    scroll-snap-align: start;
    position: relative;
    min-height: calc(var(--card-w) * 0.75);
    cursor: pointer;
`

const AnimeCardSkeletonContentBlock = styled.div`
    height: 35%;
`
