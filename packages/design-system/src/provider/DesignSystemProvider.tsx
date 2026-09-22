import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from 'react'
import { buildTheme } from '../themes/buildTheme.js'
import { themeToCssVars } from '../themes/cssVariables.js'
import type {
    BuildThemeInput,
    PaletteOverrides,
    ResolvedTheme,
} from '../themes/types.js'
import type { Mode, VariantName } from '../variants/types.js'
import type { CustomPalette, Palette, PaletteName } from '../palettes/types.js'
import type { BaseTokens } from '../tokens/types.js'
import type { BorderVariant } from '../components/borderVariant.js'
import { DesignSystemContext } from './context.js'
import { FocusStyles } from './FocusStyles.js'
import { InteractionStyles } from './InteractionStyles.js'
import { TypographyStyles } from './TypographyStyles.js'

export type FontFamilyOverrides = {
    sans?: string
    serif?: string
    mono?: string
    display?: string
}

export type DesignSystemProviderProps = {
    palette?: PaletteName | Palette | CustomPalette
    variant?: VariantName
    mode?: Mode
    borderVariant?: BorderVariant
    /** fontFamily 토큰 일부/전체 덮어쓰기. tokenOverrides의 단축. */
    fonts?: FontFamilyOverrides
    paletteOverrides?: PaletteOverrides
    tokenOverrides?: Partial<BaseTokens>
    applyTo?: 'root' | 'scope'
    className?: string
    style?: CSSProperties
    children: ReactNode
}

const DEFAULT_PALETTE: PaletteName = 'lavender'
const DEFAULT_VARIANT: VariantName = 'minimal'
const DEFAULT_MODE: Mode = 'light'
const DEFAULT_BORDER_VARIANT: BorderVariant = 'outlined'

/**
 * prop 을 초기값 겸 재정의 신호로 쓰는 상태.
 * prop 이 바뀌면 그 값으로 되돌리고, 그 사이에는 반환된 setter(컨텍스트의 setPalette 등)로
 * 자유롭게 바꿀 수 있다.
 *
 * useEffect 로 맞추면 이전 값으로 한 번 커밋해 화면에 그린 뒤 다시 그려서 테마가 깜빡인다.
 * 렌더 중에 맞추면 React 가 커밋 전에 즉시 다시 렌더하므로 깜빡임이 없다.
 */
const usePropSyncedState = <T,>(
    prop: T | undefined,
    fallback: T,
): readonly [T, Dispatch<SetStateAction<T>>] => {
    const [value, setValue] = useState<T>(prop ?? fallback)
    const [prevProp, setPrevProp] = useState(prop)
    if (prop !== undefined && prop !== prevProp) {
        setPrevProp(prop)
        setValue(prop)
    }
    return [value, setValue] as const
}

const applyVarsToElement = (
    element: HTMLElement | null,
    vars: Record<string, string>,
    previousKeys: Set<string>,
): Set<string> => {
    if (!element) return previousKeys
    for (const key of previousKeys) {
        if (!(key in vars)) {
            element.style.removeProperty(key)
        }
    }
    const nextKeys = new Set<string>()
    for (const [key, value] of Object.entries(vars)) {
        element.style.setProperty(key, value)
        nextKeys.add(key)
    }
    return nextKeys
}

export const DesignSystemProvider = ({
    palette: paletteProp,
    variant: variantProp,
    mode: modeProp,
    borderVariant: borderVariantProp,
    fonts: fontsProp,
    paletteOverrides,
    tokenOverrides,
    applyTo = 'root',
    className,
    style,
    children,
}: DesignSystemProviderProps) => {
    const [fonts, setFontsState] = useState<FontFamilyOverrides | undefined>(
        fontsProp,
    )
    const [prevFontsProp, setPrevFontsProp] = useState(fontsProp)
    if (fontsProp !== prevFontsProp) {
        setPrevFontsProp(fontsProp)
        setFontsState(fontsProp)
    }

    const mergedTokenOverrides = useMemo<
        Partial<BaseTokens> | undefined
    >(() => {
        if (!fonts || Object.keys(fonts).length === 0) return tokenOverrides
        const fontFamily: Record<string, string> = {}
        if (fonts.sans) fontFamily.sans = fonts.sans
        if (fonts.serif) fontFamily.serif = fonts.serif
        if (fonts.mono) fontFamily.mono = fonts.mono
        if (fonts.display) fontFamily.display = fonts.display
        return {
            ...tokenOverrides,
            typography: {
                ...(tokenOverrides?.typography ?? {}),
                fontFamily: {
                    ...(tokenOverrides?.typography?.fontFamily ?? {}),
                    ...fontFamily,
                },
            } as BaseTokens['typography'],
        }
    }, [fonts, tokenOverrides])

    const [palette, setPaletteState] = usePropSyncedState<
        PaletteName | Palette | CustomPalette
    >(paletteProp, DEFAULT_PALETTE)
    const [variant, setVariantState] = usePropSyncedState<VariantName>(
        variantProp,
        DEFAULT_VARIANT,
    )
    const [mode, setModeState] = usePropSyncedState<Mode>(modeProp, DEFAULT_MODE)
    const [borderVariant, setBorderVariantState] =
        usePropSyncedState<BorderVariant>(
            borderVariantProp,
            DEFAULT_BORDER_VARIANT,
        )

    const theme: ResolvedTheme = useMemo(() => {
        const input: BuildThemeInput = {
            palette,
            variant,
            mode,
            paletteOverrides,
            tokenOverrides: mergedTokenOverrides,
        }
        return buildTheme(input)
    }, [palette, variant, mode, paletteOverrides, mergedTokenOverrides])

    const cssVars = useMemo(() => themeToCssVars(theme), [theme])
    const scopeRef = useRef<HTMLDivElement | null>(null)
    const previousKeysRef = useRef<Set<string>>(new Set())

    useEffect(() => {
        if (applyTo !== 'root') return
        if (typeof document === 'undefined') return
        previousKeysRef.current = applyVarsToElement(
            document.documentElement,
            cssVars,
            previousKeysRef.current,
        )
        document.documentElement.dataset.dsPalette = theme.paletteName
        document.documentElement.dataset.dsVariant = theme.variantName
        document.documentElement.dataset.dsMode = theme.mode
        // 네이티브 위젯(스크롤바, select, date 피커)이 모드를 따라오게 한다.
        document.documentElement.style.colorScheme = theme.mode
        const ssrStyle = document.querySelector('style[data-ds-init="true"]')
        if (ssrStyle && ssrStyle.parentNode) {
            ssrStyle.parentNode.removeChild(ssrStyle)
        }
    }, [applyTo, cssVars, theme.paletteName, theme.variantName, theme.mode])

    const scopeStyle = useMemo<CSSProperties | undefined>(() => {
        if (applyTo !== 'scope') return style
        return {
            ...(cssVars as CSSProperties),
            colorScheme: mode,
            ...style,
        }
    }, [applyTo, cssVars, mode, style])

    const setPalette = useCallback(
        (next: string) => setPaletteState(next as PaletteName),
        [],
    )
    const setVariant = useCallback(
        (next: VariantName) => setVariantState(next),
        [],
    )
    const setMode = useCallback((next: Mode) => setModeState(next), [])
    const setBorderVariant = useCallback(
        (next: BorderVariant) => setBorderVariantState(next),
        [],
    )
    const setFonts = useCallback(
        (next: FontFamilyOverrides | undefined) => setFontsState(next),
        [],
    )
    const toggleMode = useCallback(
        () => setModeState((prev) => (prev === 'light' ? 'dark' : 'light')),
        [],
    )

    const value = useMemo(
        () => ({
            theme,
            borderVariant,
            fonts,
            setPalette,
            setVariant,
            setMode,
            setBorderVariant,
            setFonts,
            toggleMode,
        }),
        [
            theme,
            borderVariant,
            fonts,
            setPalette,
            setVariant,
            setMode,
            setBorderVariant,
            setFonts,
            toggleMode,
        ],
    )

    if (applyTo === 'scope') {
        return (
            <DesignSystemContext.Provider value={value}>
                <FocusStyles />
                <InteractionStyles />
                <TypographyStyles />
                <div
                    ref={scopeRef}
                    className={className}
                    style={scopeStyle}
                    data-ds-palette={theme.paletteName}
                    data-ds-variant={theme.variantName}
                    data-ds-mode={theme.mode}
                >
                    {children}
                </div>
            </DesignSystemContext.Provider>
        )
    }

    return (
        <DesignSystemContext.Provider value={value}>
            <FocusStyles />
            <InteractionStyles />
            <TypographyStyles />
            {children}
        </DesignSystemContext.Provider>
    )
}
