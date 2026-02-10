import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import SlideCardTrack from '../../components/home/SlideCardTrack'
import SlideLayout from '../../components/home/SlideLayout'
import { useAnimeCardTrack } from '../../components/home/hook/useTrackMove'
import { useAdvertiseList } from '../../libs/apis/ad'
import { themedPalette } from '../../libs/style/theme'

const SlideContainer = () => {
    const { data = [], isLoading: apiLoading, isError } = useAdvertiseList()
    const { state, onNext, onPrev } = useAnimeCardTrack(data.length - 1)
    const [imgLoading, setImgLoading] = useState(true)

    const handleImageLoad = () => {
        setImgLoading(false)
    }

    const knobPercent = data.length > 1 ? (state / data.length) * 100 : 100

    return (
        <SlideLayout isLoading={imgLoading} onNext={onNext} onPrev={onPrev}>
            <SlideCardTrack
                isApiLoading={apiLoading}
                isImageLoading={imgLoading}
                isError={isError}
                card={data}
                now={state}
                onLoad={handleImageLoad}
            />

            {data.length > 0 && (
                <ProgressBarWrapper>
                    <ProgressKnob
                        knobPercent={knobPercent}
                        knobWidth={100 / data.length}
                    />
                </ProgressBarWrapper>
            )}
        </SlideLayout>
    )
}

export default SlideContainer

const ProgressBarWrapper = styled.div`
    position: absolute;
    bottom: 0;
    height: 4px;
    width: 100vw;
    background-color: ${themedPalette.gray2};
    border-radius: 2px;
    overflow: hidden;
`

const ProgressKnob = styled.div<{ knobPercent: number; knobWidth: number }>`
    position: absolute;
    bottom: 0;
    left: ${({ knobPercent }) => `${knobPercent}%`};
    width: ${({ knobWidth }) => `${knobWidth}%`};
    height: 100%;
    background-color: ${themedPalette.primary1};
    border-radius: 2px;
    transition: left 0.3s ease;
`
