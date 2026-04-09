import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import AnimeCard from '@components/home/AnimeCard'
import SearchCardSkeleton from '@components/search/SearchCardSkeleton'
import { SearchAnimationItem } from '@libs/apis/animations/type'
import { useTranslation } from 'react-i18next'

interface SearchGridProps {
    results: SearchAnimationItem[]
    isLoading: boolean
    lastElementRef?: React.RefObject<HTMLDivElement>
}

const SKELETON_COUNT = 15

const SearchGrid: React.FC<SearchGridProps> = ({ results, isLoading, lastElementRef }) => {
    const { t } = useTranslation()
    if (isLoading) {
        return (
            <Grid as="ol">
                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    <SearchCardSkeleton key={i} />
                ))}
            </Grid>
        )
    }

    if (results.length === 0) {
        return (
            <EmptyWrapper align="center" justify="center">
                <EmptyText>{t('search.noResults')}</EmptyText>
            </EmptyWrapper>
        )
    }

    return (
        <Flex direction="column" gap="0.75rem">
            <ResultCount>{t('search.resultCount', { count: results.length })}</ResultCount>
            <Grid as="ol">
                {results.map((item, index) => {
                    const isLastItem = index === results.length - 1
                    return (
                        <div key={item.id} ref={isLastItem ? lastElementRef : undefined}>
                            <AnimeCard
                                id={item.id}
                                title={item.title}
                                thumbnailUrl={item.thumbnailUrl}
                                type={item.type}
                                ageRating={item.ageRating}
                                genres={item.genres}
                                status={item.status}
                                showDetails={true}
                            />
                        </div>
                    )
                })}
            </Grid>
        </Flex>
    )
}

export default SearchGrid

const Grid = styled(Flex)`
    --card-w: 20em;

    @media (max-width: 1023px) {
        --card-w: 18em;
    }
    @media (max-width: 767px) {
        --card-w: 15em;
    }

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--card-w), 1fr));
    gap: 1.5rem 1.5em;
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    user-select: none;
`

const EmptyWrapper = styled(Flex)`
    width: 100%;
    min-height: 300px;
`

const EmptyText = styled.span`
    font-size: 1rem;
    color: ${themedPalette.text4};
`

const ResultCount = styled.span`
    font-size: 0.875rem;
    color: ${themedPalette.text3};
`
