import { createContext } from 'react'
import type { ResolvedTheme } from '../themes/types.js'
import type { BorderVariant } from '../components/borderVariant.js'

export type FontFamilyOverrides = {
    sans?: string
    serif?: string
    mono?: string
    display?: string
}

export type DesignSystemContextValue = {
    theme: ResolvedTheme
    borderVariant: BorderVariant
    fonts: FontFamilyOverrides | undefined
    setPalette: (palette: string) => void
    setVariant: (variant: ResolvedTheme['variantName']) => void
    setMode: (mode: ResolvedTheme['mode']) => void
    setBorderVariant: (variant: BorderVariant) => void
    setFonts: (fonts: FontFamilyOverrides | undefined) => void
    toggleMode: () => void
}

export const DesignSystemContext =
    createContext<DesignSystemContextValue | null>(null)
