import { AxiosError, AxiosInstance } from 'axios'
import { JwtOptions } from './axiosTypes'

let refreshPromise: Promise<void> | null = null

const attachJwtInterceptor = (instance: AxiosInstance, jwt: JwtOptions) => {
    // Bearer 적용
    instance.interceptors.request.use(
        (config) => {
            const token = jwt.accessTokenGetter()
            if (token) config.headers['Authorization'] = `Bearer ${token}`
            return config
        },
        (error: AxiosError) => Promise.reject(error),
    )

    // 401 시 refresh, 중복 refresh 방지
    instance.interceptors.response.use(
        (res) => res,
        async (error) => {
            if (error.response?.status !== 401) return Promise.reject(error)

            const refreshToken = jwt.refreshTokenGetter()
            if (!refreshToken) {
                jwt.onRefreshFail?.()
                return Promise.reject(error)
            }

            if (!refreshPromise) {
                refreshPromise = jwt
                    .useReissue(refreshToken)
                    .finally(() => {
                        refreshPromise = null
                    })
            }

            try {
                await refreshPromise
                return instance(error.config)
            } catch {
                jwt.onRefreshFail?.()
                return Promise.reject(error)
            }
        },
    )
}

export default attachJwtInterceptor
