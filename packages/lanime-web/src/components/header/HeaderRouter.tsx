import styled from '@emotion/styled'
import routers from '../../libs/constants/routers'
import { NavLink } from 'react-router-dom'
import Text from '../common/Text'
import { themedPalette } from '../../libs/style/theme'

export default function HeaderRouter({ currentUrl }: { currentUrl: string }) {
    return (
        <HeaderRouterBlock>
            {routers.map((route) => (
                <StyledNavLink
                    key={route.path}
                    to={route.path}
                    className={currentUrl === route.path ? 'active' : ''}
                >
                    <Text sz="mdBt" color={themedPalette.button_text}>
                        {route.title}
                    </Text>
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
`
