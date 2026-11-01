import { useCallback, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import Icon from '@components/common/Icon'
import { themedPalette } from '@libs/style/theme'
import type {
    QualityOption,
    QualitySelection,
} from '@hooks/player/useShakaPlayer'
import { PLAYBACK_RATES } from '@hooks/player/usePlaybackRate'

type Panel = 'main' | 'quality' | 'speed'

interface SettingsMenuProps {
    qualities: QualityOption[]
    selectedQuality: QualitySelection
    activeQualityHeight: number | null
    playbackRate: number
    onSelectQuality: (selection: QualitySelection) => void
    onSelectPlaybackRate: (rate: number) => void
    onOpenChange?: (open: boolean) => void
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
    qualities,
    selectedQuality,
    activeQualityHeight,
    playbackRate,
    onSelectQuality,
    onSelectPlaybackRate,
    onOpenChange,
}) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const [panel, setPanel] = useState<Panel>('main')
    const wrapperRef = useRef<HTMLDivElement>(null)

    const close = useCallback(() => {
        setOpen(false)
        setPanel('main')
    }, [])

    // 메뉴가 열려 있는 동안에는 컨트롤 바가 자동으로 숨지 않도록 알려준다.
    // 열린 채로 언마운트(예: 미니 플레이어 전환)되면 잠금이 남지 않게 풀어준다.
    useEffect(() => {
        onOpenChange?.(open)
        return () => {
            if (open) onOpenChange?.(false)
        }
    }, [open, onOpenChange])

    useEffect(() => {
        if (!open) return

        const handlePointerDown = (event: Event) => {
            if (!wrapperRef.current?.contains(event.target as Node)) close()
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') close()
        }

        document.addEventListener('mousedown', handlePointerDown)
        document.addEventListener('touchstart', handlePointerDown)
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('mousedown', handlePointerDown)
            document.removeEventListener('touchstart', handlePointerDown)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [open, close])

    const qualityValue =
        selectedQuality === 'auto'
            ? activeQualityHeight
                ? `${t('player.auto')} · ${activeQualityHeight}p`
                : t('player.auto')
            : `${selectedQuality}p`

    const speedValue =
        playbackRate === 1 ? t('player.normalSpeed') : `${playbackRate}x`

    const handleQuality = (selection: QualitySelection) => {
        onSelectQuality(selection)
        close()
    }

    const handleSpeed = (rate: number) => {
        onSelectPlaybackRate(rate)
        close()
    }

    return (
        <Wrapper ref={wrapperRef}>
            <IconButton
                type="button"
                onClick={() => (open ? close() : setOpen(true))}
                aria-label={t('player.settings')}
                aria-haspopup="menu"
                aria-expanded={open}
                $open={open}
            >
                <Icon
                    name="settings"
                    color={themedPalette.white}
                    aria-label={t('player.settings')}
                />
            </IconButton>

            {open && (
                <MenuPanel role="menu">
                    {panel === 'main' && (
                        <List>
                            {qualities.length > 0 && (
                                <Row
                                    type="button"
                                    role="menuitem"
                                    onClick={() => setPanel('quality')}
                                >
                                    <RowLabel>{t('player.quality')}</RowLabel>
                                    <RowValue>
                                        {qualityValue}
                                        <Icon
                                            name="chevronRight"
                                            size={16}
                                            color={themedPalette.gray3}
                                        />
                                    </RowValue>
                                </Row>
                            )}
                            <Row
                                type="button"
                                role="menuitem"
                                onClick={() => setPanel('speed')}
                            >
                                <RowLabel>{t('player.playbackSpeed')}</RowLabel>
                                <RowValue>
                                    {speedValue}
                                    <Icon
                                        name="chevronRight"
                                        size={16}
                                        color={themedPalette.gray3}
                                    />
                                </RowValue>
                            </Row>
                        </List>
                    )}

                    {panel === 'quality' && (
                        <>
                            <PanelHeader
                                type="button"
                                onClick={() => setPanel('main')}
                                aria-label={t('common.goBack')}
                            >
                                <Icon
                                    name="chevronLeft"
                                    size={18}
                                    color={themedPalette.white}
                                />
                                {t('player.quality')}
                            </PanelHeader>
                            <List>
                                <OptionRow
                                    type="button"
                                    role="menuitemradio"
                                    aria-checked={selectedQuality === 'auto'}
                                    $selected={selectedQuality === 'auto'}
                                    onClick={() => handleQuality('auto')}
                                >
                                    <CheckSlot>
                                        {selectedQuality === 'auto' && (
                                            <Icon
                                                name="check"
                                                size={16}
                                                color={themedPalette.primary1}
                                            />
                                        )}
                                    </CheckSlot>
                                    {t('player.auto')}
                                    {activeQualityHeight && (
                                        <OptionHint>
                                            {activeQualityHeight}p
                                        </OptionHint>
                                    )}
                                </OptionRow>
                                {qualities.map(({ height, label }) => (
                                    <OptionRow
                                        key={height}
                                        type="button"
                                        role="menuitemradio"
                                        aria-checked={
                                            selectedQuality === height
                                        }
                                        $selected={selectedQuality === height}
                                        onClick={() => handleQuality(height)}
                                    >
                                        <CheckSlot>
                                            {selectedQuality === height && (
                                                <Icon
                                                    name="check"
                                                    size={16}
                                                    color={
                                                        themedPalette.primary1
                                                    }
                                                />
                                            )}
                                        </CheckSlot>
                                        {label}
                                    </OptionRow>
                                ))}
                            </List>
                        </>
                    )}

                    {panel === 'speed' && (
                        <>
                            <PanelHeader
                                type="button"
                                onClick={() => setPanel('main')}
                                aria-label={t('common.goBack')}
                            >
                                <Icon
                                    name="chevronLeft"
                                    size={18}
                                    color={themedPalette.white}
                                />
                                {t('player.playbackSpeed')}
                            </PanelHeader>
                            <List>
                                {PLAYBACK_RATES.map((rate) => (
                                    <OptionRow
                                        key={rate}
                                        type="button"
                                        role="menuitemradio"
                                        aria-checked={playbackRate === rate}
                                        $selected={playbackRate === rate}
                                        onClick={() => handleSpeed(rate)}
                                    >
                                        <CheckSlot>
                                            {playbackRate === rate && (
                                                <Icon
                                                    name="check"
                                                    size={16}
                                                    color={
                                                        themedPalette.primary1
                                                    }
                                                />
                                            )}
                                        </CheckSlot>
                                        {rate === 1
                                            ? t('player.normalSpeed')
                                            : `${rate}x`}
                                    </OptionRow>
                                ))}
                            </List>
                        </>
                    )}
                </MenuPanel>
            )}
        </Wrapper>
    )
}

export default SettingsMenu

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
`

const Wrapper = styled.div`
    position: relative;
    flex-shrink: 0;
    display: flex;
    align-items: center;
`

const IconButton = styled.button<{ $open: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition:
        opacity 0.2s,
        transform 0.25s ease;
    transform: ${({ $open }) => ($open ? 'rotate(30deg)' : 'none')};

    &:hover {
        opacity: 0.7;
    }
`

// 전체화면에서도 보여야 하므로 포털이 아니라 플레이어 안에 그린다.
const MenuPanel = styled.div`
    position: absolute;
    right: 0;
    bottom: calc(100% + 0.75rem);
    min-width: 190px;
    max-height: min(280px, 50vh);
    overflow-y: auto;
    padding: 0.35rem 0;
    background: rgba(20, 20, 20, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
    color: ${themedPalette.white};
    font-size: 0.85rem;
    animation: ${fadeIn} 0.15s ease;
    z-index: 30;
`

const List = styled.div`
    display: flex;
    flex-direction: column;
`

const rowBase = `
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.6rem 0.85rem;
    background: none;
    border: none;
    color: inherit;
    font-size: inherit;
    text-align: left;
    cursor: pointer;
    transition: background 0.12s;

    &:hover {
        background: rgba(255, 255, 255, 0.12);
    }
`

const Row = styled.button`
    ${rowBase}
    justify-content: space-between;
    gap: 0.75rem;
`

const RowLabel = styled.span`
    white-space: nowrap;
`

const RowValue = styled.span`
    display: flex;
    align-items: center;
    gap: 0.15rem;
    color: ${themedPalette.gray3};
    white-space: nowrap;
`

const PanelHeader = styled.button`
    ${rowBase}
    gap: 0.35rem;
    font-weight: 600;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
`

const OptionRow = styled.button<{ $selected: boolean }>`
    ${rowBase}
    gap: 0.35rem;
    color: ${({ $selected }) =>
        $selected ? themedPalette.primary1 : 'inherit'};
    font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
`

const CheckSlot = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    flex-shrink: 0;
`

const OptionHint = styled.span`
    margin-left: auto;
    color: ${themedPalette.gray3};
    font-size: 0.75rem;
    font-weight: 400;
`
