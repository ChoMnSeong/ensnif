import React, { useState } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Textarea from '@components/common/Textarea'
import Button from '@components/common/Button'
import AnimationStarSelector from '@components/home/AnimationStarSelector'
import { useTranslation } from 'react-i18next'

interface AnimationReviewWriteProps {
    onCreate: (rating: number, comment: string) => void
    isPending: boolean
}

const MAX_COMMENT = 500

const AnimationReviewWrite: React.FC<AnimationReviewWriteProps> = ({
    onCreate,
    isPending,
}) => {
    const { t } = useTranslation()
    const [hoverRating, setHoverRating] = useState(0)
    const [selectedRating, setSelectedRating] = useState(0)
    const [comment, setComment] = useState('')

    const handleSubmit = () => {
        if (selectedRating === 0 || isPending) return
        onCreate(selectedRating, comment)
        setSelectedRating(0)
        setComment('')
        setHoverRating(0)
    }

    return (
        <WriteSection direction="column" gap="0.75rem" padding="1.25rem 0 0 0" margin="0 0 1.5rem 0" width="100%">
            <SectionTitle>{t('review.write')}</SectionTitle>
            <AnimationStarSelector
                rating={selectedRating}
                hoverRating={hoverRating}
                onRatingChange={setSelectedRating}
                onHoverChange={setHoverRating}
            />
            <Textarea
                placeholder={t('review.placeholder')}
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
                count={comment.length}
                maxCount={MAX_COMMENT}
            />
            <Flex justify="flex-end">
                <Button
                    variant="primary"
                    size="sm"
                    disabled={selectedRating === 0 || isPending}
                    onClick={handleSubmit}
                >
                    {isPending ? t('review.submitting') : t('review.submit')}
                </Button>
            </Flex>
        </WriteSection>
    )
}

export default AnimationReviewWrite

const WriteSection = styled(Flex)`
    border-top: 1px solid ${themedPalette.border2};
`

const SectionTitle = styled.span`
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    color: ${themedPalette.text2};
`
