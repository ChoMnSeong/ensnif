import React, { ReactNode } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Icon from '@components/common/Icon'
import Flex from '@components/common/Flex'

interface ProfileModalLayoutProps {
    children: ReactNode
    onClose: () => void
}

const ProfileModalLayout: React.FC<ProfileModalLayoutProps> = ({
    children,
    onClose,
}) => {
    return (
        <ModalOverlay direction="column" justify="center" align="center" onClick={onClose}>
            <CloseButton as="button" align="center" justify="center" padding="4px" onClick={onClose}>
                <Icon name="close" size={28} color={themedPalette.button_text} />
            </CloseButton>
            <ContentContainer direction="column" align="center" width="100%" onClick={(e) => e.stopPropagation()}>
                {children}
            </ContentContainer>
        </ModalOverlay>
    )
}

export default ProfileModalLayout

const ModalOverlay = styled(Flex)`
    position: fixed;
    inset: 0;
    background-color: ${themedPalette.bg_page2};
    z-index: 2000;
`

const CloseButton = styled(Flex)`
    position: absolute;
    top: 40px;
    right: 40px;
    cursor: pointer;
    z-index: 2001;
    background: none;
    border: none;
    opacity: 0.7;

    &:hover {
        opacity: 1;
    }
`

const ContentContainer = styled(Flex)``
