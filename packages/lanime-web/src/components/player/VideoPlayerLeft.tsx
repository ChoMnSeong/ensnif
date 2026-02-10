import React from 'react'
import styled from '@emotion/styled'
import Image from '../common/Image'
import Text from '../common/Text'

import skipNext from '../../assets/skipNext.svg'
import rewind from '../../assets/rewind.svg'

interface VideoPlayerLeftProps {
    rewindHandler: () => void
}

const VideoPlayerLeft: React.FC<VideoPlayerLeftProps> = ({ rewindHandler }) => {
    return (
        <Container>
            <NextButton>
                <Text sz="smBt" color={'white'}>
                    <Image src={skipNext} alt="다음 화" />
                </Text>
            </NextButton>
            <RewindButton onClick={rewindHandler}>
                <Image src={rewind} alt={'10초 뒤로가기'} />
            </RewindButton>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding-left: 6.5rem;
`

const NextButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        opacity: 0.7;
    }
`

const RewindButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    transition: opacity 0.3s ease;

    &:hover {
        opacity: 0.7;
    }
`

export default VideoPlayerLeft
