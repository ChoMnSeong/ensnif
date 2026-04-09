import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import Image from '@components/common/Image'
import Flex from '@components/common/Flex'
import { themedPalette } from '@libs/style/theme'
import { FavoriteAnimation } from '@libs/apis/likes/type'

interface FavoriteCardProps {
    animation: FavoriteAnimation
    onClick: () => void
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ animation, onClick }) => {
    return (
        <Card onClick={onClick}>
            <ThumbWrapper>
                <Image
                    src={animation.thumbnailUrl}
                    alt={animation.title}
                    height="auto"
                    width="100%"
                    $aspectRatio="16/9"
                    borderRadius="0.5rem"
                    loading="lazy"
                />
                <Overlay>
                    <PlayButton>
                        <PlayIcon />
                    </PlayButton>
                </Overlay>
            </ThumbWrapper>

            <InfoBlock direction="column" gap="0.2rem">
                <AnimationTitle>{animation.title}</AnimationTitle>
            </InfoBlock>
        </Card>
    )
}

export default FavoriteCard

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`

const Overlay = styled.div`
    position: absolute;
    inset: 0;
    border-radius: 0.5rem;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
`

const PlayButton = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`

const PlayIcon = styled.div`
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 8px 0 8px 14px;
    border-color: transparent transparent transparent #1a1a1a;
    margin-left: 3px;
`

const ThumbWrapper = styled.div`
    position: relative;
    border-radius: 0.5rem;
    overflow: hidden;
`

const InfoBlock = styled(Flex)`
    padding: 0.5rem 0.1rem 0;
`

const AnimationTitle = styled.span`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${themedPalette.text1};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const Card = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    min-width: 0;

    &:hover ${Overlay} {
        opacity: 1;
        animation: ${fadeIn} 0.2s ease;
    }
`
