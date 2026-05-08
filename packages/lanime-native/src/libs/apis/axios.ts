import * as customAxios from '@ensnif/common'
import { router } from 'expo-router'
import tokenStorage from '@libs/tokenStorage'
import { env } from '@libs/env'
import { useReissue } from '@libs/apis/auth/reissue'
import i18n from '@libs/i18n'
import { store } from '@stores'

if (__DEV__) {
    if (!env.BASE_URL) {
        console.warn(
            '[axios] EXPO_PUBLIC_BASE_URL is not set — API calls will fail. Create packages/lanime-native/.env with EXPO_PUBLIC_BASE_URL=...',
        )
    } else {
        console.log('[axios] BASE_URL =', env.BASE_URL)
    }
}

const handleRefreshFail = async () => {
    const wasLoggedIn = !!tokenStorage.get.accessToken()
    await Promise.all([
        tokenStorage.remove.accessToken(),
        tokenStorage.remove.refreshToken(),
        tokenStorage.remove.profileToken(),
    ])
    if (wasLoggedIn) {
        router.replace('/auth/mail')
    }
}

const jwtOptions: customAxios.JwtOptions = {
    accessTokenGetter: () => tokenStorage.get.accessToken() ?? undefined,
    refreshTokenGetter: () => tokenStorage.get.refreshToken() ?? undefined,
    useReissue,
    onRefreshFail: handleRefreshFail,
}

export const instance = customAxios.createTokenAxios({
    mode: 'jwt',
    jwt: jwtOptions,
    configResolver: (config) => {
        const isUpload =
            typeof FormData !== 'undefined' && config.data instanceof FormData
        const profileToken = tokenStorage.get.profileToken()
        const userProfile = store.getState().userProfile
        const userAge = userProfile?.age

        const method = config.method?.toLowerCase()
        const isGetRequest = method === 'get'

        let params = config.params || {}
        if (isGetRequest && userAge) {
            params = { ...params, userAge }
        }

        return {
            ...config,
            params,
            headers: {
                ...config.headers,
                'X-Profile-Token': profileToken ?? undefined,
                'X-Client-Time': Date.now().toString(),
                'Accept-Language': i18n.language ?? 'ko',
            },
            timeout: isUpload ? 60000 : config.timeout,
        }
    },
    axiosConfig: {
        baseURL: env.BASE_URL,
        timeout: env.TIMEOUT,
    },
})
