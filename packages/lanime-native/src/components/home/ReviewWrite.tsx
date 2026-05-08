import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { StarRating } from '@components/common/StarRating'
import { useCreateAnimationReview } from '@libs/apis/animations'

interface Props {
    animationId: string
    onDone?: () => void
}

export const ReviewWrite = ({ animationId, onDone }: Props) => {
    const { t } = useTranslation()
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const create = useCreateAnimationReview(animationId)

    const submit = async () => {
        if (rating === 0) return
        try {
            await create.mutateAsync({ rating, comment })
            setRating(0)
            setComment('')
            onDone?.()
        } catch {
            Toast.show({ type: 'error', text1: t('auth.serverError') })
        }
    }

    return (
        <View className="px-4 pb-3 border-b border-border-1">
            <Text className="text-fg-1 font-semibold mb-2">
                {t('review.write')}
            </Text>
            <View className="mb-3">
                <StarRating value={rating} onChange={setRating} />
            </View>
            <TextInput
                value={comment}
                onChangeText={setComment}
                multiline
                placeholder={t('review.placeholder')}
                placeholderTextColor="#848484"
                className="bg-bg-el2 text-fg-1 rounded-xl px-3 py-2 min-h-[64px] border border-border-1"
                style={{ textAlignVertical: 'top' }}
            />
            <View className="flex-row justify-end mt-2">
                <Pressable
                    onPress={submit}
                    disabled={rating === 0 || create.isPending}
                    className={`px-4 h-9 rounded-lg items-center justify-center ${
                        rating === 0 || create.isPending
                            ? 'bg-bg-el3'
                            : 'bg-primary'
                    }`}
                >
                    <Text className="text-white text-xs font-semibold">
                        {create.isPending
                            ? t('review.submitting')
                            : t('review.submit')}
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}
