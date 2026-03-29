import HeaderLogo from '@components/header/HeaderLogo'
import HeaderRouter from '@components/header/HeaderRouter'
import styled from '@emotion/styled'
import HeaderUserIcon from '@components/header/HeaderUserIcon'
import { useLocation, NavLink, Link } from 'react-router-dom'
import { themedPalette } from '@libs/style/theme'
import { useSelector } from 'react-redux'
import { RootState } from '@stores/index'
import { useEffect, useRef, useState } from 'react'
import HeaderProfileDropdownContainer from '@containers/header/HeaderProfileDropdownContainer'
import Text from '@components/common/Text'
import Icon from '@components/common/Icon'
import routers from '@libs/constants/routers'

const Header: React.FC = () => {
    const profile = useSelector((state: RootState) => state.userProfile)
    const { pathname } = useLocation()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const profileIconRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    const handleMouseEnter = () => setIsDropdownOpen(true)
    const handleMouseLeave = () => setIsDropdownOpen(false)

    return (
        <>
            <HeaderBlock url={pathname}>
                <HeaderInner>
                    <Left>
                        <HeaderLogo />
                        <DesktopNav>
                            <HeaderRouter currentUrl={pathname} />
                        </DesktopNav>
                    </Left>
                    <Right>
                        {profile.avatarUrl ? (
                            <ProfileIconWrapper
                                ref={profileIconRef}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <HeaderUserIcon picture={profile.avatarUrl} />
                                <NicknameText>
                                    {profile.nickname && (
                                        <Text
                                            sz="smCt"
                                            color={themedPalette.text1}
                                        >
                                            {profile.nickname}
                                        </Text>
                                    )}
                                </NicknameText>
                                {isDropdownOpen && (
                                    <HeaderProfileDropdownContainer
                                        anchorEl={profileIconRef.current}
                                        onClose={() => setIsDropdownOpen(false)}
                                        onMouseEnter={handleMouseEnter}
                                    />
                                )}
                            </ProfileIconWrapper>
                        ) : (
                            <DesktopOnly>
                                <LoginLink to="/auth/mail" state={{ from: pathname }}>
                                    로그인/가입
                                </LoginLink>
                            </DesktopOnly>
                        )}

                        <HamburgerButton
                            onClick={() => setIsMobileMenuOpen((v) => !v)}
                            aria-label={
                                isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'
                            }
                        >
                            <Icon
                                name={isMobileMenuOpen ? 'close' : 'menu'}
                                size={24}
                                color={themedPalette.button_text}
                            />
                        </HamburgerButton>
                    </Right>
                </HeaderInner>
            </HeaderBlock>

            <MobileMenu open={isMobileMenuOpen}>
                <MobileNavList>
                    {routers.map((route) => (
                        <MobileNavLink
                            key={route.path}
                            to={route.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={pathname === route.path ? 'active' : ''}
                        >
                            {route.title}
                        </MobileNavLink>
                    ))}
                </MobileNavList>
                <MobileDivider />
                <MobileActions>
                    {!profile.avatarUrl && (
                        <LoginLink to="/auth/mail" state={{ from: pathname }}>
                            로그인/가입
                        </LoginLink>
                    )}
                </MobileActions>
            </MobileMenu>
        </>
    )
}

const bp = {
    mobile: '767px',
    tablet: '1023px',
}

const HeaderBlock = styled.div<{ url: string }>`
    position: ${({ url }) =>
        url.includes('player') ? 'relative' : 'absolute'};
    background-color: ${themedPalette.bg_page1};
    top: 0;
    z-index: 10;
    width: 100vw;
    height: 4rem;
`

const HeaderInner = styled.div`
    width: calc(100% - 60px);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: auto;

    @media (max-width: ${bp.mobile}) {
        width: calc(100% - 32px);
    }
`

const Left = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    gap: 120px;

    @media (max-width: ${bp.tablet}) {
        gap: 40px;
    }

    @media (max-width: ${bp.mobile}) {
        gap: 0;
    }
`

const Right = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    gap: 60px;

    @media (max-width: ${bp.tablet}) {
        gap: 24px;
    }

    @media (max-width: ${bp.mobile}) {
        gap: 12px;
    }
`

const DesktopNav = styled.div`
    @media (max-width: ${bp.mobile}) {
        display: none;
    }
`

const DesktopOnly = styled.div`
    @media (max-width: ${bp.mobile}) {
        display: none;
    }
`

const ProfileIconWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 8px;
    cursor: default;
`

const NicknameText = styled.div`
    @media (max-width: ${bp.tablet}) {
        display: none;
    }
`

const HamburgerButton = styled.button`
    display: none;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: ${themedPalette.button_text};

    @media (max-width: ${bp.mobile}) {
        display: flex;
    }
`

const MobileMenu = styled.div<{ open: boolean }>`
    display: none;
    position: fixed;
    top: 4rem;
    left: 0;
    right: 0;
    z-index: 9;
    background-color: ${themedPalette.bg_element1};
    border-bottom: 1px solid ${themedPalette.border2};
    padding: 1rem 1.5rem;
    flex-direction: column;
    gap: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    transform: ${({ open }) => (open ? 'translateY(0)' : 'translateY(-8px)')};
    opacity: ${({ open }) => (open ? 1 : 0)};
    pointer-events: ${({ open }) => (open ? 'auto' : 'none')};
    transition:
        transform 0.2s ease,
        opacity 0.2s ease;

    @media (max-width: ${bp.mobile}) {
        display: flex;
    }
`

const MobileNavList = styled.nav`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`

const MobileNavLink = styled(NavLink)`
    text-decoration: none;
    padding: 0.75rem 0.5rem;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    color: ${themedPalette.button_text};
    transition: background-color 0.15s ease;

    &:hover,
    &.active {
        background-color: ${themedPalette.bg_element3};
    }
`

const MobileDivider = styled.div`
    height: 1px;
    background-color: ${themedPalette.border2};
    margin: 0.5rem 0;
`

const MobileActions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
`

const LoginLink = styled(Link)`
    text-decoration: none;
    font-size: 1rem;
    font-weight: 600;
    color: ${themedPalette.button_text};

    &:hover {
        opacity: 0.7;
    }
`

export default Header
