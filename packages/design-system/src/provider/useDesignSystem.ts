import { useContext } from 'react'
import { DesignSystemContext } from './context.js'
import type { BorderVariant } from '../components/borderVariant.js'

export const useDesignSystem = () => {
    const ctx = useContext(DesignSystemContext)
    if (!ctx) {
        throw new Error(
            'useDesignSystem must be used inside <DesignSystemProvider>.',
        )
    }
    return ctx
}

export const useTheme = () => useDesignSystem().theme

export const useBorderVariant = (override?: BorderVariant): BorderVariant => {
    const ctx = useContext(DesignSystemContext)
    return override ?? ctx?.borderVariant ?? 'outlined'
}

/** @deprecated use useBorderVariant */
export const useInputVariant = useBorderVariant
