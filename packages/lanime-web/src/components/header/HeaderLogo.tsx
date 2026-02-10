import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import Image from '../common/Image'
import whiteLogo from '../../assets/whiteLogo.svg'
import blackLogo from '../../assets/blackLogo.svg'
import { useEffect, useState } from 'react'

interface HeaderLogoProps {
    theme?: 'light' | 'dark'
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ theme = 'light' }) => {
    const [logo, setLogo] = useState<string>(
        theme === 'light' ? blackLogo : whiteLogo,
    )

    useEffect(() => {
        setLogo(theme === 'light' ? blackLogo : whiteLogo)
    }, [theme])

    return (
        <HeaderLogoBlock>
            <Link to="/">
                <Image src={logo} alt="logo" width={'auto'} height={60} />
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
