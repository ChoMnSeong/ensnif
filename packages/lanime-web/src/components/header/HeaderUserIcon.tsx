import styled from '@emotion/styled'
import Image from '@components/common/Image'

interface IHeaderUserIcon {
    onClick?: () => void
    picture: string
}

export default function HeaderUserIcon({ onClick, picture }: IHeaderUserIcon) {
    return (
        <HeaderUserIconBlock onClick={onClick}>
            <Image
                src={picture}
                alt="profile"
                width={32}
                height={32}
                borderRadius="50%"
            />
        </HeaderUserIconBlock>
    )
}

const HeaderUserIconBlock = styled.div`
    cursor: pointer;
`
