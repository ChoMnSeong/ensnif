import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { themedPalette } from '@libs/style/theme'
import Icon from '@components/common/Icon'

const LANGS = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
] as const

const LanguageSwitcher: React.FC = () => {
    const { i18n, t } = useTranslation()
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const [wrapperRect, setWrapperRect] = useState<DOMRect | null>(null)

    useEffect(() => {
        if (open && ref.current) {
            setWrapperRect(ref.current.getBoundingClientRect())
        }
    }, [open])

    const handleSelect = (code: string) => {
        i18n.changeLanguage(code)
        setOpen(false)
    }

    return (
        <Wrapper ref={ref}>
            <IconButton
                onClick={() => setOpen((v) => !v)}
                aria-label={t('header.selectLanguage')}
                active={open}
            >
                <Icon name="language" size={22} color={open ? themedPalette.primary1 : themedPalette.text1} />
            </IconButton>

            {open && createPortal(
                <>
                    <Backdrop onClick={() => setOpen(false)} />
                    {wrapperRect && (
                        <DropdownPortal style={{
                            top: `${wrapperRect.bottom + 8}px`,
                            right: `${window.innerWidth - wrapperRect.right}px`,
                        }}>
                            {LANGS.map(({ code, label }) => (
                                <DropdownItem
                                    key={code}
                                    active={i18n.language === code}
                                    onClick={() => handleSelect(code)}
                                >
                                    {label}
                                </DropdownItem>
                            ))}
                        </DropdownPortal>
                    )}
                </>,
                document.body
            )}
        </Wrapper>
    )
}

export default LanguageSwitcher

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
`

const Wrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`

const IconButton = styled.button<{ active: boolean }>`
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: background 0.15s;

    &:hover {
        background: ${themedPalette.bg_element3};
    }
`

const Backdrop = styled.div`
    position: fixed;
    inset: 0;
    z-index: 998;
`

const DropdownPortal = styled.div`
    position: fixed;
    min-width: 120px;
    background: ${themedPalette.bg_element5};
    border: 1px solid ${themedPalette.border2};
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    z-index: 999;
    animation: ${fadeIn} 0.15s ease;
`

const DropdownItem = styled.button<{ active: boolean }>`
    width: 100%;
    padding: 10px 16px;
    background: none;
    border: none;
    text-align: left;
    font-size: 0.875rem;
    font-weight: ${({ active }) => (active ? 700 : 400)};
    color: ${({ active }) => (active ? themedPalette.primary1 : themedPalette.text2)};
    cursor: ${({ active }) => (active ? 'default' : 'pointer')};
    transition: background 0.12s;

    &:hover {
        background: ${themedPalette.bg_element3};
    }
`
