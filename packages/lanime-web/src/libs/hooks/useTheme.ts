import { useEffect, useState } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'

const getSystemTheme = (): 'light' | 'dark' =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const getInitialPreference = (): ThemePreference => {
    if (typeof window === 'undefined') return 'light'
    return (localStorage.getItem('theme') as ThemePreference) || 'system'
}

const resolveTheme = (preference: ThemePreference): 'light' | 'dark' => {
    if (preference === 'system') return getSystemTheme()
    return preference
}

const useTheme = () => {
    const [themePreference, setThemePreferenceState] =
        useState<ThemePreference>(getInitialPreference)

    const theme = resolveTheme(themePreference)

    useEffect(() => {
        document.body.setAttribute('data-theme', theme)
    }, [theme])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setThemePreferenceState(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    const setThemePreference = (preference: ThemePreference) => {
        setThemePreferenceState(preference)
        localStorage.setItem('theme', preference)
    }

    return { theme, themePreference, toggleTheme, setThemePreference }
}

export default useTheme
