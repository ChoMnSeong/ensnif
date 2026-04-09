import styled from '@emotion/styled'
import { useSimilarAnimations } from '@libs/apis/animations'
import Image from '@components/common/Image'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import { useTranslation } from 'react-i18next'
import { themedPalette } from '@libs/style/theme'
import { useDispatch } from 'react-redux'
import { openModal } from '@stores/episodeModal/reducer'
import { useEffect, useRef } from 'react'

interface SimilarAnimationsProps {
    animationId: string
    scrollContainerRef?: React.RefObject<HTMLDivElement | null>
}

const SimilarAnimations: React.FC<SimilarAnimationsProps> = ({
    animationId,
    scrollContainerRef,
}) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const observerRef = useRef<HTMLDivElement | null>(null)
    const {
        data,
        isLoading,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useSimilarAnimations(animationId, 80, 10)

    const similarAnimations = data?.pages.flatMap((page) => page.data) ?? []

    const handleCardClick = (id: string, title: string) => {
        dispatch(
            openModal({
                animationId: id,
                title: title,
            }),
        )
    }

    useEffect(() => {
        if (!observerRef.current) return
        if (!hasNextPage || isFetchingNextPage) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0]?.isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage()
                }
            },
            {
                root: scrollContainerRef?.current,
                rootMargin: '200px',
                threshold: 0.1,
            },
        )

        observer.observe(observerRef.current)

        return () => observer.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, scrollContainerRef])

    if (isLoading) {
        return (
            <Container justify="center" align="center">
                <Text color={themedPalette.text2}>{t('common.loading')}</Text>
            </Container>
        )
    }

    if (error) {
        return (
            <Container justify="center" align="center">
                <Text color={themedPalette.text2}>
                    {t('common.errorOccurred')}
                </Text>
            </Container>
        )
    }

    if (!similarAnimations || similarAnimations.length === 0) {
        return (
            <Container justify="center" align="center">
                <Text color={themedPalette.text2}>
                    {t('modal.noSimilarAnimations', {
                        defaultValue: 'No similar animations found',
                    })}
                </Text>
            </Container>
        )
    }

    return (
        <Container direction="column" width="100%" gap="1rem">
            <GridContainer>
                {similarAnimations.map((animation, index) => (
                    <CardWrapper
                        key={`${animation.id}-${index}`}
                        onClick={() =>
                            handleCardClick(animation.id, animation.title)
                        }
                        ref={
                            index === similarAnimations.length - 1
                                ? observerRef
                                : null
                        }
                    >
                        <ImageContainer>
                            <Image
                                src={animation.thumbnailUrl}
                                alt={animation.title}
                                height={'auto'}
                                width={'100%'}
                                $aspectRatio="2/3"
                                borderRadius="0.5rem"
                                loading="lazy"
                            />
                        </ImageContainer>
                        <TitleContainer>
                            <CardTitle>{animation.title}</CardTitle>
                        </TitleContainer>
                    </CardWrapper>
                ))}
            </GridContainer>
            {isFetchingNextPage && (
                <LoadingContainer justify="center" align="center">
                    <Text color={themedPalette.text2}>
                        {t('common.loading')}
                    </Text>
                </LoadingContainer>
            )}
        </Container>
    )
}

export default SimilarAnimations

const Container = styled(Flex)`
    width: 100%;
    padding: 0 1rem;
    min-height: 200px;

    @media (max-width: 480px) {
        padding: 0 0.5rem;
    }
`

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
    width: 100%;

    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 0.75rem;
    }

    @media (max-width: 480px) {
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 0.5rem;
    }
`

const CardWrapper = styled.div`
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 0.5rem;
    overflow: hidden;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
`

const LoadingContainer = styled(Flex)`
    width: 100%;
    padding: 2rem;
`

const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 2/3;
    overflow: hidden;
    border-radius: 0.5rem;
`

const TitleContainer = styled.div`
    padding: 0.5rem 0.25rem;
    min-height: 2.4rem;
`

const CardTitle = styled.p`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${themedPalette.text1};
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
`
