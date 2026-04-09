import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import Flex from '@components/common/Flex'
import { themedPalette } from '@libs/style/theme'
import SearchFilters from '@components/search/SearchFilters'
import SearchGrid from '@components/search/SearchGrid'
import { useInfiniteSearchAnimations } from '@libs/apis/animations'
import { SearchParams } from '@libs/apis/animations/type'
import Icon from '@components/common/Icon'
import { useTranslation } from 'react-i18next'

const SearchContainer: React.FC = () => {
    const { t } = useTranslation()
    const [params, setParams] = useState<SearchParams>({})
    const [queryInput, setQueryInput] = useState('')
    const lastElementRef = useRef<HTMLDivElement>(null)

    const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteSearchAnimations(params)

    const results = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data])

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage()
                }
            },
            { threshold: 0.1 }
        )

        const currentRef = lastElementRef.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const handleChange = (next: Partial<SearchParams>) => {
        setParams((prev) => ({ ...prev, ...next }))
    }

    const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setQueryInput(value)
        setParams((prev) => ({ ...prev, query: value || undefined }))
    }, [])

    return (
        <Wrapper gap="2.5rem" align="flex-start">
            <SearchFilters params={params} onChange={handleChange} />
            <Content direction="column" gap="1.5rem" flex={1}>
                <PageTitle>{t('search.title')}</PageTitle>
                <SearchInputWrapper align="center" gap="0.5rem">
                    <Icon name="search" size={18} color={themedPalette.text3} />
                    <SearchInput
                        type="text"
                        placeholder={t('search.placeholder')}
                        value={queryInput}
                        onChange={handleQueryChange}
                    />
                </SearchInputWrapper>
                <SearchGrid
                    results={results}
                    isLoading={isLoading}
                    lastElementRef={lastElementRef}
                />
            </Content>
        </Wrapper>
    )
}

export default SearchContainer

const Wrapper = styled(Flex)`
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 3rem 2rem 4rem;

    @media (max-width: 767px) {
        flex-direction: column;
        padding: 2rem 1rem 3rem;
        gap: 1.5rem;
    }
`

const Content = styled(Flex)`
    min-width: 0;
`

const PageTitle = styled.h1`
    font-size: 1.75rem;
    font-weight: 700;
    color: ${themedPalette.text1};
    margin: 0;
`

const SearchInputWrapper = styled(Flex)`
    background: ${themedPalette.bg_element2};
    border: 1px solid ${themedPalette.border2};
    border-radius: 8px;
    padding: 0 1rem;
    transition: border-color 0.15s;

    &:focus-within {
        border-color: ${themedPalette.primary1};
    }
`

const SearchInput = styled.input`
    flex: 1;
    height: 44px;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.95rem;
    color: ${themedPalette.text1};

    &::placeholder {
        color: ${themedPalette.text3};
    }
`
