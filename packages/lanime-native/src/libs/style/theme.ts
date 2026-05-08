export type ThemeMode = 'light' | 'dark'

export interface ThemePalette {
    bgPage1: string
    bgPage2: string
    bgEl1: string
    bgEl2: string
    bgEl3: string
    text1: string
    text2: string
    text3: string
    text4: string
    border1: string
    border2: string
    primary1: string
    primary2: string
    success: string
    destructive: string
    disabled: string
}

export const palettes: Record<ThemeMode, ThemePalette> = {
    light: {
        bgPage1: '#fafaf9',
        bgPage2: '#f5f5f4',
        bgEl1: '#FFFFFF',
        bgEl2: '#FDFBF6',
        bgEl3: '#e7e5e4',
        text1: '#1A1A1A',
        text2: '#222222',
        text3: '#3B3B3B',
        text4: '#595959',
        border1: '#2C2C2C',
        border2: '#ADB5BD',
        primary1: '#b473f9',
        primary2: '#d2a9ff',
        success: '#3399FF',
        destructive: '#FF6B6B',
        disabled: '#CED4DA',
    },
    dark: {
        bgPage1: '#1A1A1A',
        bgPage2: '#222222',
        bgEl1: '#1E1E1E',
        bgEl2: '#252525',
        bgEl3: '#2E2E2E',
        text1: '#FAFAF8',
        text2: '#ECEAE4',
        text3: '#ACACAC',
        text4: '#848484',
        border1: '#2C2C2C',
        border2: '#4D4D4D',
        primary1: '#b473f9',
        primary2: '#d2a9ff',
        success: '#3399FF',
        destructive: '#FF6B6B',
        disabled: '#595959',
    },
}
