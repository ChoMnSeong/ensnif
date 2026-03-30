import React, { useState } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Input from '@components/common/Input'
import Button from '@components/common/Button'

interface DeleteConfirmModalProps {
    title: string
    description: string
    confirmPhrase: string
    confirmLabel?: string
    isLoading?: boolean
    onConfirm: () => void
    onClose: () => void
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    title,
    description,
    confirmPhrase,
    confirmLabel = '삭제',
    isLoading = false,
    onConfirm,
    onClose,
}) => {
    const [value, setValue] = useState('')
    const isMatch = value === confirmPhrase

    return (
        <Flex
            align="center"
            justify="center"
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.55)',
                zIndex: 1000,
            }}
        >
            <Flex
                direction="column"
                padding="2rem"
                width="360px"
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: themedPalette.bg_element1,
                    border: `1px solid ${themedPalette.border2}`,
                    borderRadius: '12px',
                }}
            >
                <Text sz="mdCt" color={themedPalette.text1} style={{ fontWeight: 600 }}>
                    {title}
                </Text>
                <Text sz="smCt" color={themedPalette.text3} style={{ marginTop: '0.5rem' }}>
                    {description}
                </Text>

                <PhraseBox>
                    <Text sz="smCt" color={themedPalette.text2}>
                        {confirmPhrase}
                    </Text>
                </PhraseBox>

                <Input
                    placeholder="위 문구를 그대로 입력해주세요"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && isMatch && !isLoading) onConfirm()
                    }}
                />

                <Flex gap="0.75rem" width="100%" margin="1.5rem 0 0 0">
                    <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>
                        취소
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={!isMatch || isLoading}
                        style={{ flex: 1 }}
                    >
                        {isLoading ? '삭제 중...' : confirmLabel}
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default DeleteConfirmModal

const PhraseBox = styled.div`
    margin: 1rem 0 0.75rem;
    padding: 0.75rem 1rem;
    background-color: ${themedPalette.bg_element2};
    border-radius: 6px;
    border-left: 3px solid ${themedPalette.destructive1};
`
