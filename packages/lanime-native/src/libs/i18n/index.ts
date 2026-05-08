import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Localization } from './localization'
import ko from './locales/ko.json'
import en from './locales/en.json'
import ja from './locales/ja.json'

const LANG_KEY = 'lanime_lang'
const SUPPORTED = ['ko', 'en', 'ja']

const detectInitialLang = (): string => {
    const device = Localization.getLocale()?.split('-')[0]
    if (device && SUPPORTED.includes(device)) return device
    return 'ko'
}

i18n.use(initReactI18next).init({
    resources: {
        ko: { translation: ko },
        en: { translation: en },
        ja: { translation: ja },
    },
    lng: detectInitialLang(),
    fallbackLng: 'ko',
    interpolation: { escapeValue: false },
    initImmediate: false,
})

export const hydrateLanguage = async () => {
    try {
        const saved = await AsyncStorage.getItem(LANG_KEY)
        if (saved && SUPPORTED.includes(saved) && saved !== i18n.language) {
            await i18n.changeLanguage(saved)
        }
    } catch {
        // ignore
    }
}

i18n.on('languageChanged', (lng) => {
    AsyncStorage.setItem(LANG_KEY, lng).catch(() => {})
})

export default i18n
