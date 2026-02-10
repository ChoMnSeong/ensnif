import { env } from '../env'
import { useReissue } from './auth'
import * as test from '@ensnif/common'

const jwtOptions: test.JwtOptions = {
    accessTokenGetter: () => localStorage.getItem('accessToken'),
    refreshTokenGetter: () => localStorage.getItem('refreshToken'),
    useReissue,
}

export const instance = test.createTokenAxios({
    mode: 'jwt',
    jwt: jwtOptions,
    axiosConfig: {
        baseURL: env.BASE_URL,
        timeout: env.TIMEOUT,
    },
})
