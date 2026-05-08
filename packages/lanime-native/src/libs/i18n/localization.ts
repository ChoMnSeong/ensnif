import { NativeModules, Platform } from 'react-native'

const getLocale = (): string => {
    try {
        if (Platform.OS === 'ios') {
            const settings = NativeModules.SettingsManager?.settings
            return (
                settings?.AppleLocale ??
                settings?.AppleLanguages?.[0] ??
                'ko-KR'
            )
        }
        if (Platform.OS === 'android') {
            return NativeModules.I18nManager?.localeIdentifier ?? 'ko-KR'
        }
        if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
            return navigator.language ?? 'ko-KR'
        }
    } catch {
        // ignore
    }
    return 'ko-KR'
}

export const Localization = { getLocale }
