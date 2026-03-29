import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'

export interface Comment {
    id: number
    author: string
    content: string
    time: string
}

interface CommentListItemProps {
    comment: Comment
}

const CommentListItem: React.FC<CommentListItemProps> = ({ comment }) => {
    return (
        <Item>
            <Avatar />
            <Body>
                <Header>
                    <Author>{comment.author}</Author>
                    <Time>{comment.time}</Time>
                </Header>
                <Content>{comment.content}</Content>
            </Body>
        </Item>
    )
}

export default CommentListItem

const Item = styled.div`
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
`

const Avatar = styled.div`
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: ${themedPalette.bg_element3};
`

const Body = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
`

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
`

const Author = styled.span`
    font-size: 0.85rem;
    font-weight: 700;
    color: ${themedPalette.text1};
`

const Time = styled.span`
    font-size: 0.75rem;
    color: ${themedPalette.text4};
`

const Content = styled.p`
    font-size: 0.88rem;
    color: ${themedPalette.text2};
    line-height: 1.6;
    margin: 0;
`
