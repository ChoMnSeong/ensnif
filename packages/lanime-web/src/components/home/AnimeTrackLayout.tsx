import styled from '@emotion/styled'
import Text from '../common/Text'
import { themedPalette } from '../../libs/style/theme'

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
        <AnimeTrackLayoutBlock>
            <AnimeHeadBlock>
                <AnimeTitleBlock>
                    <Text sz={'mdTl'} color={themedPalette.text1}>
                        {title}
                    </Text>
                </AnimeTitleBlock>
                {option}
            </AnimeHeadBlock>
            <AnimeTrackBlock>{children}</AnimeTrackBlock>
        </AnimeTrackLayoutBlock>
    )
}

export default AnimeTrackLayout

const AnimeTrackLayoutBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`

const AnimeHeadBlock = styled.div`
    padding: 0px 3.125em;
`

const AnimeTitleBlock = styled.div`
    padding-bottom: 1.5em;
`

const AnimeTrackBlock = styled.div`
    width: 100%;
`
