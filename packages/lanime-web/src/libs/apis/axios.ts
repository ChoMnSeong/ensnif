import customCookie from '../customCookie'
import { env } from '../env'
import { useReissue } from './auth'
import * as customAxios from '@ensnif/common'

const jwtOptions: customAxios.JwtOptions = {
    accessTokenGetter: () => customCookie.get.accessToken(),
    refreshTokenGetter: () => customCookie.get.refreshToken(),
    useReissue,
}

export const instance = customAxios.createTokenAxios({
    mode: 'jwt',
    jwt: jwtOptions,
    // configResolver를 통해 더 세밀한 제어 가능
    configResolver: (config) => {
        const isUpload = config.data instanceof FormData
        const profileToken = customCookie.get.profileToken()

        return {
            ...config,
            headers: {
                ...config.headers,
                // 업로드 요청일 때만 특정 헤더 추가
                'X-Profile-Token': profileToken,
                // 클라이언트 타임스탬프 주입
                'X-Client-Time': Date.now().toString(),
            },
            // 특정 API 도메인 분기 처리 등 가능
            timeout: isUpload ? 60000 : config.timeout,
        }
    },
    axiosConfig: {
        baseURL: env.BASE_URL,
        timeout: env.TIMEOUT,
    },
})
