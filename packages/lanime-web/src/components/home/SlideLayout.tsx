import styled from '@emotion/styled'
import Icon from '@components/common/Icon'
import Flex from '@components/common/Flex'

interface SlideLayoutProps {
    children: React.ReactNode
    onPrev: () => void
    onNext: () => void
    hasPrev: boolean
    hasNext: boolean
    isLoading: boolean
}

const SlideLayout: React.FC<SlideLayoutProps> = ({
    children,
    onPrev,
    onNext,
    hasPrev,
    hasNext,
    isLoading,
}) => {
    return (
        <Container>
            {hasPrev && (
                <SlideArrowButton
                    onClick={onPrev}
                    disabled={isLoading}
                    isPrev
                    align="center"
                    justify="center"
                >
                    <Icon name="chevronLeft" size={32} color="white" />
                </SlideArrowButton>
            )}
            <ContentContainer>{children}</ContentContainer>
            {hasNext && (
                <SlideArrowButton
                    onClick={onNext}
                    disabled={isLoading}
                    align="center"
                    justify="center"
                >
                    <Icon name="chevronRight" size={32} color="white" />
                </SlideArrowButton>
            )}
        </Container>
    )
}

export default SlideLayout

const SlideArrowButton = styled(Flex)<{ disabled: boolean; isPrev?: boolean }>`
    z-index: 2;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 4em;
    background-color: rgba(0, 0, 0, 0.45);
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
    opacity: 0;
    transition: opacity 250ms ease-in-out;

    ${({ isPrev }) => (isPrev ? 'left: 0;' : 'right: 0;')}

    &:hover {
        opacity: 1;
    }
`

const ContentContainer = styled.div`
    width: 100vw;
    overflow: hidden;
    height: 100%;
    position: relative;
`

const Container = styled.div`
    position: relative;
    display: block;
    font-size: calc(16vw / (1920 + 16) * 100);
    height: 51.375em;
`
