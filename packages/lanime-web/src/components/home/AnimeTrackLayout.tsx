import React from 'react'
import styled from '@emotion/styled'
import Text from '@components/common/Text'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'

interface AnimeTrackLayoutProps {
    children: React.ReactNode
    option?: React.ReactNode
    title: string
}

const AnimeTrackLayout: React.FC<AnimeTrackLayoutProps> = ({
    title,
    children,
    option,
}) => {
    return (
        <AnimeTrackWrapper direction="column" width="100%">
            <AnimeHeadBlock>
                <AnimeTitleBlock>
                    <Text sz={'mdTl'} color={themedPalette.text1}>
                        {title}
                    </Text>
                </AnimeTitleBlock>
                {option}
            </AnimeHeadBlock>
            <AnimeTrackBlock justify="flex-start" wrap="nowrap" width="100%">
                {children}
            </AnimeTrackBlock>
        </AnimeTrackWrapper>
    )
}

export default AnimeTrackLayout

const AnimeTrackWrapper = styled(Flex)`
    --card-w: 18.625em;

    @media (max-width: 1023px) {
        --card-w: 13em;
    }
    @media (max-width: 767px) {
        --card-w: 10em;
    }

    position: relative;
    user-select: none;
`

const AnimeHeadBlock = styled.div`
    padding: 0 3.125em;

    @media (max-width: 767px) {
        padding: 0 1em;
    }
`

const AnimeTitleBlock = styled.div`
    padding-bottom: 1.5em;
`

const AnimeTrackBlock = styled(Flex)`
    flex-wrap: nowrap;
    min-height: calc(var(--card-w) * 0.75);
    overflow-x: visible;
`
