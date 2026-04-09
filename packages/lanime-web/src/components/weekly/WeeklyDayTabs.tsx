import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import { useTranslation } from 'react-i18next'

const AIR_DAY_KEYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const

interface WeeklyDayTabsProps {
    selectedDay: number
    onSelect: (index: number) => void
}

const WeeklyDayTabs: React.FC<WeeklyDayTabsProps> = ({ selectedDay, onSelect }) => {
    const { t } = useTranslation()

    return (
        <TabList as="ul" wrap="wrap">
            {AIR_DAY_KEYS.map((key, index) => (
                <TabItem key={key} as="li">
                    <TabButton
                        type="button"
                        active={selectedDay === index}
                        onClick={() => onSelect(index)}
                    >
                        {t(`airDay.${key}`)}
                    </TabButton>
                </TabItem>
            ))}
        </TabList>
    )
}

export default WeeklyDayTabs

const TabList = styled(Flex)`
    border-bottom: 1px solid ${themedPalette.border2};
    gap: 0;
    list-style: none;
    padding: 0;
    margin: 0;
`

const TabItem = styled(Flex)`
    list-style: none;
`

const activeStyle = css`
    color: var(--tab-active-color);
    border-bottom: 2px solid var(--tab-active-color);
    font-weight: 700;
`

const TabButton = styled.button<{ active: boolean }>`
    --tab-active-color: ${themedPalette.primary1};

    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: ${themedPalette.text3};
    cursor: pointer;
    white-space: nowrap;
    transition:
        color 0.15s ease,
        border-color 0.15s ease;
    margin-bottom: -1px;

    &:hover {
        color: ${themedPalette.text1};
    }

    ${({ active }) => active && activeStyle}

    @media (max-width: 767px) {
        padding: 0.75rem 0.875rem;
        font-size: 0.9rem;
    }
`
