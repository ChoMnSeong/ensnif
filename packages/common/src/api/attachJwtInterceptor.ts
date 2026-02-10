import { AxiosError, AxiosInstance } from 'axios'
import { JwtOptions } from './axiosTypes'

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

    // 401/403 시 refresh
    instance.interceptors.response.use(
        (res) => res,
        async (error) => {
            const refreshToken = jwt.refreshTokenGetter()
            if (!refreshToken) return Promise.reject(error)

            if (
                error.response &&
                (error.response.status === 401 || error.response.status === 403)
            ) {
                try {
                    await jwt.useReissue(refreshToken)

                    return instance(error.config)
                } catch (refreshError) {
                    return Promise.reject(error)
                }
            }

            return Promise.reject(error)
        },
    )
}

export default attachJwtInterceptor
