import styled from '@emotion/styled'
import Image from '../common/Image'

interface SlideLayoutProps {
    children: React.ReactNode
    onPrev: () => void
    onNext: () => void
    isLoading: boolean
}

const SlideLayout: React.FC<SlideLayoutProps> = ({
    children,
    onPrev,
    onNext,
    isLoading,
}) => {
    return (
        <Container>
            <PrevButton onClick={onPrev} disabled={isLoading}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#1f1f1f"
                >
                    <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
                </svg>
            </PrevButton>
            <ContentContainer>{children}</ContentContainer>
            <NextButton onClick={onNext} disabled={isLoading}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    width="24px"
                    viewBox="0 -960 960 960"
                    fill="#1f1f1f"
                    style={{ transform: 'rotate(180deg)' }}
                >
                    <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
                </svg>
            </NextButton>
        </Container>
    )
}

export default SlideLayout

const Container = styled.div`
    position: relative;
    display: block;
    font-size: calc(16vw / (1920 + 16) * 100);
    height: 51.375em;
`

const ContentContainer = styled.div`
    width: 100vw;
    overflow: hidden;
    height: 100%;
    position: relative;
`

const PrevButton = styled.div<{ disabled: boolean }>`
    z-index: 1;
    position: absolute;
    top: 0px;
    font-size: 2em;
    bottom: 0px;
    width: 3.125em;
    display: flex;
    align-items: center;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    left: 0px;
    padding-left: 0.5em;
    justify-content: flex-start;
    color: ${(props) => (props.disabled ? 'gray' : 'black')};
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
`

const NextButton = styled.div<{ disabled: boolean }>`
    z-index: 1;
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 3.125em;
    display: flex;
    font-size: 2em;
    align-items: center;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    right: 0px;
    padding-right: 0.5em;
    justify-content: flex-end;
    color: ${(props) => (props.disabled ? 'gray' : 'black')};
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
`
