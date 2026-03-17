import HeaderLogo from './HeaderLogo'
import HeaderRouter from './HeaderRouter'
import styled from '@emotion/styled'
import HeaderUserIcon from './HeaderUserIcon'
import customCookie from '../../libs/customCookie'
import { useLocation, useNavigate } from 'react-router-dom'
import TextButton from '../common/TextButton'
import { themedPalette } from '../../libs/style/theme'

export interface HeaderProps {
    theme: 'dark' | 'light'
    toggleTheme: () => void
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    const userToken = customCookie.get.accessToken()
    const { pathname } = useLocation()
    const navigate = useNavigate()

    const handleLoginClick = () => {
        // 로그인 페이지로 이동
        navigate('/auth/mail', { state: { from: pathname } })
    }

    return (
        <HeaderBlock url={pathname}>
            <HeaderInner>
                <Left>
                    <HeaderLogo theme={theme} />
                    <HeaderRouter currentUrl={pathname} />
                </Left>
                <Right>
                    <TextButton
                        onClick={toggleTheme}
                        className={'darkLightButton'}
                        disabled={false}
                        type={'button'}
                        color={themedPalette.button_text}
                        sz="mdBt"
                        active={false}
                    >
                        다크화이트
                    </TextButton>
                    {userToken ? (
                        <HeaderUserIcon picture="https://blog.kakaocdn.net/dna/1o4Al/btq4p3Nwo83/AAAAAAAAAAAAAAAAAAAAAHn23fSLJEhL91CajhMUqvYwvey8hve_EOS5SlxKHlEV/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=7H4CeviAhBHzkKX1vdvtEzc0vdo%3D" />
                    ) : (
                        <TextButton
                            sz="mdBt"
                            color={themedPalette.button_text}
                            className="loginButton"
                            disabled={false}
                            type="button"
                            active={false}
                            onClick={handleLoginClick}
                        >
                            로그인/회원가입
                        </TextButton>
                    )}
                </Right>
            </HeaderInner>
        </HeaderBlock>
    )
}

const HeaderBlock = styled.div<{ url: string }>`
    position: ${({ url }) =>
        url.includes('player') ? 'relative' : 'absolute'};
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
`

const Left = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    gap: 120px;
`

const Right = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    gap: 60px;
`

export default Header
