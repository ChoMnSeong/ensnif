import * as SecureStore from 'expo-secure-store'

const KEYS = {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    profileToken: 'profile_token',
} as const

const memoryCache: Record<string, string | null> = {
    [KEYS.accessToken]: null,
    [KEYS.refreshToken]: null,
    [KEYS.profileToken]: null,
}

const getSync = (key: string) => memoryCache[key]

const setSecure = async (key: string, value: string | null) => {
    memoryCache[key] = value
    if (value === null) {
        await SecureStore.deleteItemAsync(key)
    } else {
        await SecureStore.setItemAsync(key, value)
    }
}

export const hydrateTokenStorage = async () => {
    const [access, refresh, profile] = await Promise.all([
        SecureStore.getItemAsync(KEYS.accessToken),
        SecureStore.getItemAsync(KEYS.refreshToken),
        SecureStore.getItemAsync(KEYS.profileToken),
    ])
    memoryCache[KEYS.accessToken] = access
    memoryCache[KEYS.refreshToken] = refresh
    memoryCache[KEYS.profileToken] = profile
}

const tokenStorage = {
    get: {
        accessToken: () => getSync(KEYS.accessToken),
        refreshToken: () => getSync(KEYS.refreshToken),
        profileToken: () => getSync(KEYS.profileToken),
    },
    set: {
        authToken: async (
            accessToken: string,
            refreshToken: string | undefined,
            _expiresIn: number,
        ) => {
            await setSecure(KEYS.accessToken, accessToken)
            if (refreshToken) {
                await setSecure(KEYS.refreshToken, refreshToken)
            }
        },
        profileToken: async (profileToken: string | undefined) => {
            if (profileToken) {
                await setSecure(KEYS.profileToken, profileToken)
            }
        },
    },
    remove: {
        accessToken: () => setSecure(KEYS.accessToken, null),
        refreshToken: () => setSecure(KEYS.refreshToken, null),
        profileToken: () => setSecure(KEYS.profileToken, null),
    },
} as const

export default tokenStorage
