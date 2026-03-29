import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import Logo from '@components/header/Logo'

const HeaderLogo: React.FC = () => {
    return (
        <HeaderLogoBlock>
            <Link to="/">
                <Logo height={36} />
            </Link>
        </HeaderLogoBlock>
    )
}

export default HeaderLogo

const HeaderLogoBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    a {
        display: inline-flex;
    }
`
