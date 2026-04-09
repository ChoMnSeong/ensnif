import React from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Button from '@components/common/Button'
import PinInput from '@components/common/PinInput'
import { useTranslation } from 'react-i18next'

interface SettingsPinSectionProps {
    pin: string[]
    onChange: (pin: string[]) => void
    onDelete: () => void
    isDeleting: boolean
}

const SettingsPinSection: React.FC<SettingsPinSectionProps> = ({
    pin,
    onChange,
    onDelete,
    isDeleting,
}) => {
    const { t } = useTranslation()
    return (
        <Flex direction="column" gap="1rem">
            <SectionTitle>{t('settings.changePin')}</SectionTitle>
            <Text sz="smCt" color={themedPalette.text3}>
                {t('settings.changePinDesc')}
            </Text>
            <Flex align="center" justify="flex-start" gap="1.5rem">
                <PinInput value={pin} onChange={onChange} size="sm" />
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onDelete}
                    disabled={isDeleting}
                    type="button"
                >
                    {t('settings.deletePin')}
                </Button>
            </Flex>
        </Flex>
    )
}

export default SettingsPinSection

const SectionTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: ${themedPalette.text1};
    margin: 0;
`
