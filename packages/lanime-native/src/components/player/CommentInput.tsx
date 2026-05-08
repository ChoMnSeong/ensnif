import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useCreateCommentMutation } from '@libs/apis/comments'

interface Props {
    episodeId: string
    parentCommentId?: string
    onSubmitted?: () => void
    placeholder?: string
}

export const CommentInput = ({
    episodeId,
    parentCommentId,
    onSubmitted,
    placeholder,
}: Props) => {
    const { t } = useTranslation()
    const [content, setContent] = useState('')
    const create = useCreateCommentMutation(episodeId)

    const submit = async () => {
        const trimmed = content.trim()
        if (!trimmed) return
        await create.mutateAsync({ content: trimmed, parentCommentId })
        setContent('')
        onSubmitted?.()
    }

    return (
        <View className="flex-row items-end px-3 py-2 bg-bg-el2 border border-border-1 rounded-xl">
            <TextInput
                value={content}
                onChangeText={setContent}
                placeholder={placeholder ?? t('comment.placeholder')}
                placeholderTextColor="#848484"
                multiline
                className="flex-1 text-fg-1 max-h-24"
                style={{ textAlignVertical: 'top', paddingVertical: 4 }}
            />
            <Pressable
                onPress={submit}
                disabled={!content.trim() || create.isPending}
                className={`ml-2 px-3 h-9 rounded-lg items-center justify-center ${
                    !content.trim() || create.isPending
                        ? 'bg-bg-el3'
                        : 'bg-primary'
                }`}
            >
                <Text className="text-white text-xs font-semibold">
                    {parentCommentId
                        ? t('comment.submitReply')
                        : t('comment.submit')}
                </Text>
            </Pressable>
        </View>
    )
}
