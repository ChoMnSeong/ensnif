import styled from '@emotion/styled'
import { themedPalette } from '@libs/style/theme'
import Flex from '@components/common/Flex'
import { SearchParams } from '@libs/apis/animations/type'
import { useAnimationGenres, useAnimationTypes } from '@libs/apis/animations'
import { useTranslation } from 'react-i18next'

const STATUS_KEYS = ['UPCOMING', 'ONGOING', 'FINISHED'] as const

interface SearchFiltersProps {
    params: SearchParams
    onChange: (next: Partial<SearchParams>) => void
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ params, onChange }) => {
    const { t } = useTranslation()
    const { data: genres = [] } = useAnimationGenres()
    const { data: types = [] } = useAnimationTypes()

    const toggleGenre = (genreId: string) => {
        const current = params.genreIds ?? []
        const next = current.includes(genreId)
            ? current.filter(id => id !== genreId)
            : [...current, genreId]
        onChange({ genreIds: next.length ? next : undefined })
    }

    const toggleType = (typeId: string) => {
        const current = params.typeIds ?? []
        const next = current.includes(typeId)
            ? current.filter(id => id !== typeId)
            : [...current, typeId]
        onChange({ typeIds: next.length ? next : undefined })
    }

    const toggleStatus = (value: string) => {
        const current = params.statuses ?? []
        const next = current.includes(value)
            ? current.filter(s => s !== value)
            : [...current, value]
        onChange({ statuses: next.length ? next : undefined })
    }

    return (
        <Sidebar direction="column" gap="2rem">
            <Section direction="column" gap="0.75rem">
                <SectionTitle>{t('search.genre')}</SectionTitle>
                {genres.map((g) => (
                    <CheckRow key={g.genreId} align="center" gap="0.5rem" onClick={() => toggleGenre(g.genreId)}>
                        <Checkbox type="checkbox" checked={params.genreIds?.includes(g.genreId) ?? false} readOnly />
                        <CheckLabel active={params.genreIds?.includes(g.genreId) ?? false}>
                            {t(`genre.${g.name}`, { defaultValue: g.name })}
                        </CheckLabel>
                    </CheckRow>
                ))}
            </Section>

            <Section direction="column" gap="0.75rem">
                <SectionTitle>{t('search.status')}</SectionTitle>
                {STATUS_KEYS.map((key) => (
                    <CheckRow key={key} align="center" gap="0.5rem" onClick={() => toggleStatus(key)}>
                        <Checkbox type="checkbox" checked={params.statuses?.includes(key) ?? false} readOnly />
                        <CheckLabel active={params.statuses?.includes(key) ?? false}>
                            {t(`animationStatus.${key}`)}
                        </CheckLabel>
                    </CheckRow>
                ))}
            </Section>

            <Section direction="column" gap="0.75rem">
                <SectionTitle>{t('search.type')}</SectionTitle>
                {types.map((type) => (
                    <CheckRow key={type.typeId} align="center" gap="0.5rem" onClick={() => toggleType(type.typeId)}>
                        <Checkbox type="checkbox" checked={params.typeIds?.includes(type.typeId) ?? false} readOnly />
                        <CheckLabel active={params.typeIds?.includes(type.typeId) ?? false}>
                            {t(`animationType.${type.name}`, { defaultValue: type.name })}
                        </CheckLabel>
                    </CheckRow>
                ))}
            </Section>

            <Section direction="column" gap="0.75rem">
                <SectionTitle>{t('search.period')}</SectionTitle>
                <YearInputWrapper gap="0.5rem">
                    <YearInput
                        type="number"
                        min="1970"
                        max={new Date().getFullYear()}
                        placeholder={t('search.startYear')}
                        value={params.startYear ?? ''}
                        onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value) : undefined
                            onChange({ startYear: value })
                        }}
                    />
                    <YearRangeText>~</YearRangeText>
                    <YearInput
                        type="number"
                        min="1970"
                        max={new Date().getFullYear()}
                        placeholder={t('search.endYear')}
                        value={params.endYear ?? ''}
                        onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value) : undefined
                            onChange({ endYear: value })
                        }}
                    />
                </YearInputWrapper>
            </Section>
        </Sidebar>
    )
}

export default SearchFilters

const Sidebar = styled(Flex)`
    width: 200px;
    flex-shrink: 0;
    padding-top: 0.25rem;

    @media (max-width: 767px) {
        width: 100%;
    }
`

const Section = styled(Flex)``

const SectionTitle = styled.span`
    font-size: 1rem;
    font-weight: 700;
    color: ${themedPalette.text1};
    padding-bottom: 0.25rem;
    border-bottom: 1px solid ${themedPalette.border2};
`

const CheckRow = styled(Flex)`
    cursor: pointer;
    user-select: none;

    &:hover span {
        color: ${themedPalette.text1};
    }
`

const Checkbox = styled.input`
    accent-color: ${themedPalette.primary1};
    width: 15px;
    height: 15px;
    cursor: pointer;
    flex-shrink: 0;
`

const CheckLabel = styled.span<{ active: boolean }>`
    font-size: 0.9rem;
    color: ${({ active }) => (active ? themedPalette.text1 : themedPalette.text3)};
    font-weight: ${({ active }) => (active ? 600 : 400)};
    transition: color 0.15s;
`

const YearInputWrapper = styled(Flex)`
    flex-direction: row;
    align-items: center;
`

const YearInput = styled.input`
    width: 80px;
    height: 32px;
    padding: 0 0.5rem;
    border: 1px solid ${themedPalette.border2};
    border-radius: 4px;
    background: ${themedPalette.bg_element2};
    color: ${themedPalette.text1};
    font-size: 0.85rem;

    &::placeholder {
        color: ${themedPalette.text3};
    }

    &:focus {
        outline: none;
        border-color: ${themedPalette.primary1};
    }

    /* Chrome, Edge, Safari에서 숫자 입력 스핀 버튼 제거 */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox에서 숫자 입력 스핀 버튼 제거 */
    &[type='number'] {
        -moz-appearance: textfield;
    }
`

const YearRangeText = styled.span`
    color: ${themedPalette.text3};
    font-size: 0.9rem;
    padding: 0 0.25rem;
`
