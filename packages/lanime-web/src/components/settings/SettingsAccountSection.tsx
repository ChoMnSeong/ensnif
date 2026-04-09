import React, { useState } from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Button from '@components/common/Button'
import DeleteConfirmModal from '@components/common/DeleteConfirmModal'
import { useTranslation } from 'react-i18next'

interface SettingsAccountSectionProps {
    onDelete: () => void
    isDeleting: boolean
}

const SettingsAccountSection: React.FC<SettingsAccountSectionProps> = ({
    onDelete,
    isDeleting,
}) => {
    const { t } = useTranslation()
    const [showModal, setShowModal] = useState(false)

    return (
        <Flex direction="column" gap="1rem">
            <SectionTitle>{t('settings.deleteAccount')}</SectionTitle>
            <Flex justify="space-between" align="center" width="100%">
                <Text sz="smCt" color={themedPalette.text3}>
                    {t('settings.deleteAccountDesc')}
                </Text>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowModal(true)}
                    style={{ flexShrink: 0, marginLeft: '1rem' }}
                >
                    {t('settings.deleteAccount')}
                </Button>
            </Flex>

            {showModal && (
                <DeleteConfirmModal
                    title={t('settings.deleteAccount')}
                    description={t('settings.deleteAccountModalDesc')}
                    confirmPhrase={t('settings.deleteAccountConfirmPhrase')}
                    confirmLabel={t('settings.deleteAccount')}
                    isLoading={isDeleting}
                    onConfirm={onDelete}
                    onClose={() => setShowModal(false)}
                />
            )}
        </Flex>
    )
}

export default SettingsAccountSection

const SectionTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: ${themedPalette.text1};
    margin: 0;
`
