import customCookie from '@libs/customCookie'
import { env } from '@libs/env'
import { useReissue } from '@libs/apis/auth/reisuue'
import * as customAxios from '@ensnif/common'
import i18n from '@libs/i18n'
import { store } from '@stores'

const handleRefreshFail = () => {
    const wasLoggedIn = !!customCookie.get.accessToken()
    customCookie.remove.accessToken()
    customCookie.remove.refreshToken()
    customCookie.remove.profileToken()
    if (wasLoggedIn) {
        window.location.href = '/auth/mail'
    }
}

const jwtOptions: customAxios.JwtOptions = {
    accessTokenGetter: () => customCookie.get.accessToken(),
    refreshTokenGetter: () => customCookie.get.refreshToken(),
    useReissue,
    onRefreshFail: handleRefreshFail,
}

export const instance = customAxios.createTokenAxios({
    mode: 'jwt',
    jwt: jwtOptions,
    configResolver: (config) => {
        const isUpload = config.data instanceof FormData
        const profileToken = customCookie.get.profileToken()
        const userProfile = store.getState().userProfile
        const userAge = userProfile?.age

        const method = config.method?.toLowerCase()
        const isGetRequest = method === 'get'

        let params = config.params || {}
        if (isGetRequest && userAge) {
            params = {
                ...params,
                userAge,
            }
        }

        return {
            ...config,
            params,
            headers: {
                ...config.headers,
                'X-Profile-Token': profileToken,
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
