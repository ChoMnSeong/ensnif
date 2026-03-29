import React from 'react'
import styled from '@emotion/styled'
import { MdWbSunny, MdNightlight } from 'react-icons/md'
import { themedPalette } from '@libs/style/theme'
import { ThemePreference } from '@libs/hooks/useTheme'
import Text from '@components/common/Text'

interface SettingsThemeSectionProps {
    themePreference: ThemePreference
    onSelect: (value: ThemePreference) => void
}

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
    { value: 'light', label: '밝은 테마' },
    { value: 'dark', label: '어두운 테마' },
    { value: 'system', label: '기기 설정을 따름' },
]

const SettingsThemeSection: React.FC<SettingsThemeSectionProps> = ({
    themePreference,
    onSelect,
}) => {
    return (
        <Section>
            <SectionTitle>테마</SectionTitle>
            <ThemeCardRow>
                {THEME_OPTIONS.map(({ value, label }) => (
                    <ThemeCardWrapper key={value}>
                        <ThemeCard
                            active={themePreference === value}
                            onClick={() => onSelect(value)}
                        >
                            {value === 'light' && (
                                <LightCard>
                                    <MdWbSunny size={28} color="#1A1A1A" />
                                </LightCard>
                            )}
                            {value === 'dark' && (
                                <DarkCard>
                                    <MdNightlight size={28} color="#FAFAF8" />
                                </DarkCard>
                            )}
                            {value === 'system' && (
                                <SystemCard>
                                    <SystemHalf side="left">
                                        <MdWbSunny size={24} color="#1A1A1A" />
                                    </SystemHalf>
                                    <SystemHalf side="right">
                                        <MdNightlight
                                            size={24}
                                            color="#FAFAF8"
                                        />
                                    </SystemHalf>
                                </SystemCard>
                            )}
                        </ThemeCard>
                        <Text
                            sz="smCt"
                            color={
                                themePreference === value
                                    ? themedPalette.primary1
                                    : themedPalette.text3
                            }
                        >
                            {label}
                        </Text>
                    </ThemeCardWrapper>
                ))}
            </ThemeCardRow>
        </Section>
    )
}

export default SettingsThemeSection

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

const ThemeCardRow = styled.div`
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
`

const ThemeCardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
`

const ThemeCard = styled.div<{ active: boolean }>`
    width: 120px;
    height: 70px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid
        ${({ active }) =>
            active ? themedPalette.primary1 : themedPalette.border2};
    transition: border-color 0.15s ease;

    &:hover {
        border-color: ${({ active }) =>
            active ? themedPalette.primary1 : themedPalette.text3};
    }
`

const LightCard = styled.div`
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
`

const DarkCard = styled.div`
    width: 100%;
    height: 100%;
    background-color: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
`

const SystemCard = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
`

const SystemHalf = styled.div<{ side: 'left' | 'right' }>`
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ side }) =>
        side === 'left' ? '#ffffff' : '#1a1a1a'};
`
