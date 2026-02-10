import { useEffect, useState } from 'react'
import Header, { HeaderProps } from './Header'
import styled from '@emotion/styled'
import { themedPalette } from '../../libs/style/theme'

const FloatingHeader: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    const [visible, setVisible] = useState<boolean>(false)

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 160)
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <FloatingHeaderBlock style={{ height: visible ? '60px' : '0' }}>
            <Header theme={theme} toggleTheme={toggleTheme} />
        </FloatingHeaderBlock>
    )
}

export default FloatingHeader

const FloatingHeaderBlock = styled.div`
    width: 100%;
    background-color: ${themedPalette.bg_element1};
    top: 0;
    position: fixed;
    z-index: 20;
    overflow: hidden;
    transition: height 0.4s ease;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid ${themedPalette.border2};
`
