import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import { forwardRef } from 'react'

interface AnimeEpisodeModalLayoutProps {
    children: React.ReactNode
    visible: boolean
    onClose: () => void
}

const AnimeEpisodeModalLayout = forwardRef<
    HTMLDivElement,
    AnimeEpisodeModalLayoutProps
>(({ children, visible, onClose }, ref) => {
    if (!visible) return null

    return (
        <Overlay>
            <ModalContainer ref={ref}>
                <CloseButton onClick={onClose} aria-label="닫기">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40px"
                        viewBox="0 -960 960 960"
                        width="40px"
                        fill={themedPalette.white}
                    >
                        <path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z" />
                    </svg>
                </CloseButton>
                {children}
            </ModalContainer>
        </Overlay>
    )
})

export default AnimeEpisodeModalLayout

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
`

const ModalContainer = styled.div`
    position: relative;
    background-color: ${themedPalette.bg_element5};
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    width: 67.5rem;
    height: 100%;
    max-width: calc(-2rem + 100vw);
    max-height: calc(-2rem + 100vh);
    overflow-y: scroll;
    @media (max-width: 1024px) {
        max-width: 100vw;
        width: 100vw;
        max-height: 100%;
        border-radius: 0px;
    }
`

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: #ffffff;
    cursor: pointer;
    border-radius: 50%;
    transition:
        background-color 0.2s ease,
        color 0.2s ease;
    z-index: 3;
`
