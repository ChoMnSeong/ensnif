import { useEffect, useState } from 'react'

const getInitialTheme = (): 'light' | 'dark' => {
    return (
        (localStorage.getItem('theme') as 'light' | 'dark') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light')
    )
}

const useTheme = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)

    useEffect(() => {
        document.body.setAttribute('data-theme', theme)
    }, [theme])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    return { theme, toggleTheme }
}

export default useTheme
