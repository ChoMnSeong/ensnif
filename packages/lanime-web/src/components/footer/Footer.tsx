import styled from '@emotion/styled'
import { themedPalette } from '../../libs/style/theme'

const Footer = () => {
    return (
        <FooterContainer>
            <FooterWrapper>
                대한민국 경기도 안양시 시민대로 297 <br />
                Contact : chemins60217@gmail.com | 010-7571-2800 <br />
                Copyright © 2024 Ensnif Inc
            </FooterWrapper>
        </FooterContainer>
    )
}

export default Footer

const FooterContainer = styled.div`
    width: 100vw;
    height: 180px;
    background-color: ${themedPalette.bg_page1};
`

const FooterWrapper = styled.span`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 10px;
    padding: 30px 0 30px 4rem;
    color: ${themedPalette.text2};
`
