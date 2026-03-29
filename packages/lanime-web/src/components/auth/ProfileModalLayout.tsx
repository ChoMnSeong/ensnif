import React, { ReactNode } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Icon from '@components/common/Icon'

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
            <CloseButton onClick={onClose}>
                <Icon name="close" size={28} color={themedPalette.button_text} />
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

const CloseButton = styled.button`
    position: absolute;
    top: 40px;
    right: 40px;
    cursor: pointer;
    z-index: 2001;
    background: none;
    border: none;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;

    &:hover {
        opacity: 1;
    }
`

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`
