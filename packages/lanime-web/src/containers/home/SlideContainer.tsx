import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import SlideCardTrack from '@components/home/SlideCardTrack'
import SlideLayout from '@components/home/SlideLayout'
import { useAnimeCardTrack } from '@components/home/hook/useTrackMove'
import { useAdvertiseList } from '@libs/apis/ad'
import { themedPalette } from '@libs/style/theme'

const SlideContainer = () => {
    const { data = [], isLoading: apiLoading, isError } = useAdvertiseList()

    const { state, onNext, onPrev, hasPrev, hasNext } = useAnimeCardTrack(
        Math.max(0, data.length - 1),
    )

    const [imgLoading, setImgLoading] = useState(true)

    const handleImageLoad = () => {
        setImgLoading(false)
    }

    useEffect(() => {
        if (!apiLoading && data.length > 0) {
            setImgLoading(false)
        }
    }, [apiLoading, data.length])

    return (
        <Wrapper>
            <SlideLayout
                isLoading={imgLoading}
                onNext={onNext}
                onPrev={onPrev}
                hasPrev={hasPrev}
                hasNext={hasNext}
            >
                <SlideCardTrack
                    isApiLoading={apiLoading}
                    isImageLoading={imgLoading}
                    isError={isError}
                    card={data}
                    now={state}
                    onLoad={handleImageLoad}
                />
            </SlideLayout>

            {data.length > 0 && (
                <ProgressBarTrack>
                    <ProgressBarFill
                        fillPercent={((state + 1) / data.length) * 100}
                    />
                </ProgressBarTrack>
            )}
        </Wrapper>
    )
}

export default SlideContainer

const Wrapper = styled.div`
    position: relative;
`

const ProgressBarTrack = styled.div`
    width: 100%;
    height: 4px;
    background-color: ${themedPalette.bg_element3};
`

const ProgressBarFill = styled.div<{ fillPercent: number }>`
    height: 100%;
    width: ${({ fillPercent }) => `${fillPercent}%`};
    background-color: ${themedPalette.primary1};
    transition: width 0.3s ease;
`
