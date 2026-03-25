import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { themedPalette } from '../../libs/style/theme'
import Image from '../common/Image'
import Text from '../common/Text'

interface ProfileSwitchDropdownProps {
    nickname: string | null
    avatarUrl: string | null
    anchorEl: HTMLElement | null
    onNavigateToProfile: () => void
    onLogout: () => void
    onMouseEnter: () => void
}

const ProfileSwitchDropdown: React.FC<ProfileSwitchDropdownProps> = ({
    nickname,
    avatarUrl,
    anchorEl,
    onNavigateToProfile,
    onLogout,
    onMouseEnter,
}) => {
    const [position, setPosition] = useState({ top: 0, right: 0 })

    useEffect(() => {
        if (!anchorEl) return
        const updatePosition = () => {
            const rect = anchorEl.getBoundingClientRect()
            setPosition({
                top: rect.bottom,
                right: window.innerWidth - rect.right,
            })
        }
        updatePosition()
        window.addEventListener('resize', updatePosition)
        return () => window.removeEventListener('resize', updatePosition)
    }, [anchorEl])

    return createPortal(
        <DropdownBlock
            style={{ top: position.top, right: position.right }}
            onMouseEnter={onMouseEnter}
        >
            <ProfileRow>
                {avatarUrl && (
                    <Image
                        src={avatarUrl}
                        alt="profile"
                        width={40}
                        height={40}
                        borderRadius="50%"
                        border={`1px solid ${themedPalette.border2}`}
                    />
                )}
                <Text sz="smCt" color={themedPalette.text1}>
                    {nickname}
                </Text>
            </ProfileRow>
            <Divider />
            <ActionButton onClick={onNavigateToProfile}>
                <Text sz="smCt" color={themedPalette.text2}>
                    프로필 변경
                </Text>
            </ActionButton>
            <ActionButton onClick={onLogout}>
                <Text sz="smCt" color={themedPalette.text2}>
                    로그아웃
                </Text>
            </ActionButton>
        </DropdownBlock>,
        document.body,
    )
}

export default ProfileSwitchDropdown

const fadeInDown = keyframes`
    from {
        opacity: 0;
        transform: translateY(-6px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`

const DropdownBlock = styled.div`
    position: fixed;
    min-width: 180px;
    background-color: ${themedPalette.bg_element5};
    border: 1px solid ${themedPalette.border2};
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    z-index: 9999;
    animation: ${fadeInDown} 0.18s ease;
`

const ProfileRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
`

const Divider = styled.div`
    height: 1px;
    background-color: ${themedPalette.border2};
    margin: 0 16px;
`

const ActionButton = styled.div`
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover {
        background-color: ${themedPalette.bg_element3};
    }
`
