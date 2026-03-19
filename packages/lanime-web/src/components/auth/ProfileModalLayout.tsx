import React, { ReactNode } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '../../libs/style/theme'
import TextButton from '../common/TextButton'

interface ProfileModalLayoutProps {
    children: ReactNode
    onClose: () => void
}

const ProfileModalLayout: React.FC<ProfileModalLayoutProps> = ({
    children,
    onClose,
}) => {
    return (
        <ModalOverlay onClick={onClose}>
            <CloseButton>
                <TextButton
                    onClick={onClose}
                    color={themedPalette.button_text}
                    sz="large"
                    disabled={false}
                    type={'button'}
                    active={false}
                >
                    ✕
                </TextButton>
            </CloseButton>
            <ContentContainer onClick={(e) => e.stopPropagation()}>
                {children}
            </ContentContainer>
        </ModalOverlay>
    )
}

export default ProfileModalLayout

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background-color: ${themedPalette.bg_page2};
    z-index: 2000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const CloseButton = styled.div`
    position: absolute;
    top: 40px;
    right: 40px;
    cursor: pointer;
    z-index: 2001;
`

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`
