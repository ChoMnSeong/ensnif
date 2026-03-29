import React, { useState } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Button from '@components/common/Button'
import DeleteConfirmModal from '@components/common/DeleteConfirmModal'

const CONFIRM_PHRASE = '이 계정을 영구적으로 삭제합니다'

interface SettingsAccountSectionProps {
    onDelete: () => void
    isDeleting: boolean
}

const SettingsAccountSection: React.FC<SettingsAccountSectionProps> = ({
    onDelete,
    isDeleting,
}) => {
    const [showModal, setShowModal] = useState(false)

    return (
        <Section>
            <SectionTitle>계정 삭제</SectionTitle>
            <Flex justifyContent="space-between" alignItems="center" width="100%">
                <Text sz="smCt" color={themedPalette.text3}>
                    계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
                </Text>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowModal(true)}
                    style={{ flexShrink: 0, marginLeft: '1rem' }}
                >
                    계정 삭제
                </Button>
            </Flex>

            {showModal && (
                <DeleteConfirmModal
                    title="계정 삭제"
                    description="계정을 삭제하면 모든 데이터가 영구적으로 복구할 수 없습니다. 정말 삭제하시겠습니까?"
                    confirmPhrase={CONFIRM_PHRASE}
                    confirmLabel="계정 삭제"
                    isLoading={isDeleting}
                    onConfirm={onDelete}
                    onClose={() => setShowModal(false)}
                />
            )}
        </Section>
    )
}

export default SettingsAccountSection

const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

const SectionTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: ${themedPalette.text1};
    margin: 0;
`
