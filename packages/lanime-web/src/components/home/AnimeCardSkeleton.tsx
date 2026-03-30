import React from 'react'
import styled from '@emotion/styled'
import Skeleton from '@components/common/Skeleton'
import Flex from '@components/common/Flex'

const AnimeCardSkeleton = () => {
    return (
        <AnimeCardSkeletonBlock
            as="li"
            flex="0 0 var(--card-w)"
            width="var(--card-w)"
            gap="3%"
        >
            <Skeleton wt="100%" ht={'65%'} />
            <AnimeCardSkeletonContentBlock height="35%" direction="column">
                <Skeleton wt="100%" ht={'55%'} margin="0.25rem 0 0 0" />
                <Skeleton wt="60%" ht={'45%'} margin="0.1em 0 0 0" />
            </AnimeCardSkeletonContentBlock>
        </AnimeCardSkeletonBlock>
    )
}

export default AnimeCardSkeleton

const AnimeCardSkeletonBlock = styled(Flex)`
    list-style: none;
    scroll-snap-align: start;
    position: relative;
    min-height: calc(var(--card-w) * 0.75);
    cursor: pointer;
`

const AnimeCardSkeletonContentBlock = styled(Flex)``
