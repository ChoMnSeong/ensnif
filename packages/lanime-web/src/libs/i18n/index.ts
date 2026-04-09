import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ko from './locales/ko.json'
import en from './locales/en.json'
import ja from './locales/ja.json'

const LANG_KEY = 'lanime_lang'
const SUPPORTED = ['ko', 'en', 'ja']

const getSavedLang = () => {
    try {
        return localStorage.getItem(LANG_KEY)
    } catch {
        return null
    }
}

const savedLang = getSavedLang()
const initialLang = savedLang && SUPPORTED.includes(savedLang) ? savedLang : 'ko'

i18n.use(initReactI18next).init({
    resources: {
        ko: { translation: ko },
        en: { translation: en },
        ja: { translation: ja },
    },
    lng: initialLang,
    fallbackLng: 'ko',
    interpolation: {
        escapeValue: false,
    },
    initImmediate: false,
})

i18n.on('languageChanged', (lng) => {
    try {
        localStorage.setItem(LANG_KEY, lng)
    } catch {
        // SSR 환경에서는 무시
    }
})

export default i18n
