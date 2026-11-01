import styled from '@emotion/styled'
import Icon from '@components/common/Icon'
import { themedPalette } from '@libs/style/theme'

interface VideoPlayerProps {
    wrapperRef: React.RefObject<HTMLDivElement | null>
    containerRef: React.RefObject<HTMLDivElement | null>
    videoRef: React.RefObject<HTMLVideoElement | null>
    onTimeUpdate: () => void
    onLoadedMetadata: () => void
    cursorHidden?: boolean
    isPiP?: boolean
    onExpand?: () => void
    onClose?: () => void
    children: React.ReactNode
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    wrapperRef,
    containerRef,
    videoRef,
    children,
    onTimeUpdate,
    onLoadedMetadata,
    cursorHidden = false,
    isPiP = false,
    onExpand,
    onClose,
}) => {
    return (
        <Wrapper ref={wrapperRef}>
            <Container
                ref={containerRef}
                $cursorHidden={cursorHidden}
                $isPiP={isPiP}
            >
                <Video
                    ref={videoRef}
                    onTimeUpdate={onTimeUpdate}
                    onLoadedMetadata={onLoadedMetadata}
                />
                {isPiP && (
                    <PiPBar>
                        <PiPButton
                            onClick={onExpand}
                            aria-label="플레이어로 돌아가기"
                        >
                            <Icon
                                color={themedPalette.white}
                                name="openInFull"
                                size={18}
                                aria-label="플레이어로 돌아가기"
                            />
                        </PiPButton>
                        <PiPButton
                            onClick={onClose}
                            aria-label="미니 플레이어 닫기"
                        >
                            <Icon
                                color={themedPalette.white}
                                name="close"
                                size={18}
                                aria-label="미니 플레이어 닫기"
                            />
                        </PiPButton>
                    </PiPBar>
                )}
                {children}
            </Container>
        </Wrapper>
    )
}

export default VideoPlayer

// 원래 플레이어 자리를 유지하는 래퍼. PiP로 전환되어 Container가 fixed가 되어도
// 이 래퍼가 16:9 공간을 그대로 점유하므로 페이지 레이아웃이 밀리지 않는다.
const Wrapper = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    /* 옆 칼럼이 더 길어도 16:9를 유지하도록 세로로 늘어나지 않게 한다. */
    align-self: flex-start;
`

const Container = styled.div<{ $cursorHidden: boolean; $isPiP: boolean }>`
    position: absolute;
    inset: 0;
    background: #000;
    overflow: hidden;
    cursor: ${({ $cursorHidden }) => ($cursorHidden ? 'none' : 'default')};
    transition:
        box-shadow 0.25s ease,
        border-radius 0.25s ease;

    ${({ $isPiP }) =>
        $isPiP &&
        `
        position: fixed;
        inset: auto;
        right: clamp(0.75rem, 2vw, 1.5rem);
        bottom: clamp(0.75rem, 2vw, 1.5rem);
        width: clamp(240px, 30vw, 400px);
        height: auto;
        aspect-ratio: 16 / 9;
        border-radius: 10px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        animation: pip-in 0.25s ease;
    `}

    &:fullscreen,
    &:-webkit-full-screen {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        aspect-ratio: unset;
        border-radius: 0;
    }

    @keyframes pip-in {
        from {
            opacity: 0;
            transform: translateY(16px) scale(0.96);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`

const Video = styled.video`
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
`

const PiPBar = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.25rem;
    padding: 0.4rem 0.5rem;
    background: linear-gradient(rgba(0, 0, 0, 0.65), transparent);
    z-index: 20;
`

const PiPButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: rgba(0, 0, 0, 0.75);
    }
`
