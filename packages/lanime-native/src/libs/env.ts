import Constants from 'expo-constants'
import { Platform } from 'react-native'

const extra = Constants.expoConfig?.extra ?? {}

const rawBaseUrl =
    (extra.BASE_URL as string | undefined) ??
    process.env.EXPO_PUBLIC_BASE_URL ??
    ''

// Android emulator can't reach host's `localhost` — it must use 10.0.2.2.
const resolveBaseUrl = (url: string): string => {
    if (Platform.OS !== 'android') return url
    return url.replace(/(https?:\/\/)(localhost|127\.0\.0\.1)/, '$110.0.2.2')
}

export const env = {
    BASE_URL: resolveBaseUrl(rawBaseUrl),
    TIMEOUT: Number(
        (extra.TIMEOUT as string | number | undefined) ??
            process.env.EXPO_PUBLIC_TIMEOUT ??
            10000,
    ),
} as const
