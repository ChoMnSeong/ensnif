import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'

const Footer = () => {
    return (
        <FooterContainer>
            <FooterWrapper>
                <span>대한민국 경기도 안양시 시민대로 297</span>
                <span>Contact : chemins60217@gmail.com | 010-7571-2800</span>
                <span>Copyright © 2024 Ensnif Inc</span>
            </FooterWrapper>
        </FooterContainer>
    )
}

export default Footer

const FooterContainer = styled.div`
    width: 100%;
    background-color: ${themedPalette.bg_page1};
    border-top: 1px solid ${themedPalette.border2};
`

const FooterWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
    padding: 2rem 4rem;
    color: ${themedPalette.text4};
    font-size: 0.8rem;
    line-height: 1.6;

    @media (max-width: 767px) {
        padding: 1.5rem 1.5rem;
        font-size: 0.75rem;
    }
`
