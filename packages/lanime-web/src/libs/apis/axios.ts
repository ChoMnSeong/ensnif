import customCookie from '@libs/customCookie'
import { env } from '@libs/env'
import { useReissue } from '@libs/apis/auth/reisuue'
import * as customAxios from '@ensnif/common'

const handleRefreshFail = () => {
    customCookie.remove.accessToken()
    customCookie.remove.refreshToken()
    customCookie.remove.profileToken()
    window.location.href = '/auth/mail'
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

        return {
            ...config,
            headers: {
                ...config.headers,
                'X-Profile-Token': profileToken,
                'X-Client-Time': Date.now().toString(),
            },
            timeout: isUpload ? 60000 : config.timeout,
        }
    },
    axiosConfig: {
        baseURL: env.BASE_URL,
        timeout: env.TIMEOUT,
    },
})
