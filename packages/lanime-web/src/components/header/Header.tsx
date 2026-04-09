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
import Flex from '@components/common/Flex'
import LanguageSwitcher from '@components/header/LanguageSwitcher'
import { useTranslation } from 'react-i18next'

const Header: React.FC = () => {
    const { t } = useTranslation()
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
                <HeaderInner align="center" justify="space-between" margin="auto" height="100%">
                    <Left align="center" gap="120px" style={{ position: 'relative' }}>
                        <HeaderLogo />
                        <DesktopNav>
                            <HeaderRouter currentUrl={pathname} />
                        </DesktopNav>
                    </Left>
                    <Right align="center" gap="60px" style={{ position: 'relative' }}>
                        <LanguageSwitcher />
                        {profile.avatarUrl ? (
                            <Flex
                                align="center"
                                gap="8px"
                                padding="12px 8px"
                                style={{ cursor: 'default' }}
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
                            </Flex>
                        ) : (
                            <DesktopOnly>
                                <LoginLink to="/auth/mail" state={{ from: pathname }}>
                                    {t('header.login')}
                                </LoginLink>
                            </DesktopOnly>
                        )}

                        <HamburgerButton
                            as="button"
                            align="center"
                            justify="center"
                            onClick={() => setIsMobileMenuOpen((v) => !v)}
                            aria-label={
                                isMobileMenuOpen ? t('header.menuClose') : t('header.menuOpen')
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

            <MobileMenu open={isMobileMenuOpen} direction="column" gap="0.5rem" padding="1rem 1.5rem">
                <Flex as="nav" direction="column" gap="0.25rem">
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
                </Flex>
                <MobileDivider />
                <Flex direction="column" gap="0.25rem" padding="0.25rem 0.5rem">
                    {!profile.avatarUrl && (
                        <LoginLink to="/auth/mail" state={{ from: pathname }}>
                            {t('header.login')}
                        </LoginLink>
                    )}
                </Flex>
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
    width: 100%;
    height: 4rem;
`

const HeaderInner = styled(Flex)`
    width: calc(100% - 60px);

    @media (max-width: ${bp.mobile}) {
        width: calc(100% - 32px);
    }
`

const Left = styled(Flex)`
    @media (max-width: ${bp.tablet}) {
        gap: 40px;
    }

    @media (max-width: ${bp.mobile}) {
        gap: 0;
    }
`

const Right = styled(Flex)`
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

const NicknameText = styled.div`
    @media (max-width: ${bp.tablet}) {
        display: none;
    }
`

const HamburgerButton = styled(Flex)`
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: ${themedPalette.button_text};

    @media (max-width: ${bp.mobile}) {
        display: flex;
    }
`

const MobileMenu = styled(Flex)<{ open: boolean }>`
    display: none;
    position: fixed;
    top: 4rem;
    left: 0;
    right: 0;
    z-index: 9;
    background-color: ${themedPalette.bg_element1};
    border-bottom: 1px solid ${themedPalette.border2};
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
