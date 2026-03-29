import React from 'react'
import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import Text from '@components/common/Text'
import Button from '@components/common/Button'
import PinInput from '@components/common/PinInput'

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
    return (
        <Section>
            <SectionTitle>PIN 변경</SectionTitle>
            <Text sz="smCt" color={themedPalette.text3}>
                새 PIN 4자리를 입력하세요. 비워두면 변경되지 않습니다.
            </Text>
            <Flex alignItems="center" justifyContent="flex-start" gap="1.5rem">
                <PinInput value={pin} onChange={onChange} size="sm" />
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onDelete}
                    disabled={isDeleting}
                    type="button"
                >
                    PIN 삭제
                </Button>
            </Flex>
        </Section>
    )
}

export default SettingsPinSection

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
