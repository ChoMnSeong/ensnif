import styled from '@emotion/styled'
import routers from '@libs/constants/routers'
import { NavLink } from 'react-router-dom'
import { themedPalette } from '@libs/style/theme'

export default function HeaderRouter({ currentUrl }: { currentUrl: string }) {
    return (
        <HeaderRouterBlock>
            {routers.map((route) => (
                <StyledNavLink
                    key={route.path}
                    to={route.path}
                    className={currentUrl === route.path ? 'active' : ''}
                >
                    {route.title}
                </StyledNavLink>
            ))}
        </HeaderRouterBlock>
    )
}

const HeaderRouterBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 60px;
`

const StyledNavLink = styled(NavLink)`
    text-decoration: none;
    font-size: 1rem;
    font-weight: 600;
    color: ${themedPalette.button_text};

    &.active {
        color: ${themedPalette.primary1};
    }
`
