// packages/common/src/api/axiosFactory.ts 수정

import { TokenAxiosOptions } from './axiosTypes'
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import attachJwtInterceptor from './attachJwtInterceptor'
import attachSessionInterceptor from './attachSessionInterceptor'

const createTokenAxios = ({
    mode,
    jwt,
    axiosConfig,
    configResolver, // 추가
}: TokenAxiosOptions): AxiosInstance => {
    const instance = axios.create({
        timeout: -1,
        headers: { 'Content-Type': 'application/json' },
        ...axiosConfig,
    })

    // 커스텀 리졸버 인터셉터 (JWT 인터셉터보다 먼저 실행되게 함)
    instance.interceptors.request.use(async (config) => {
        if (configResolver) {
            // config 전체를 사용자 정의 함수로 변형 가능 (헤더, 타임아웃, URL 등)
            const resolvedConfig = await configResolver(config)
            return {
                ...config,
                ...resolvedConfig,
            } as InternalAxiosRequestConfig
        }
        return config
    })

    // mode 별 인터셉터 부착
    switch (mode) {
        case 'session':
            attachSessionInterceptor(instance)
            break
        case 'jwt':
            if (!jwt) throw new Error('`jwt` 옵션이 필요합니다.')
            attachJwtInterceptor(instance, jwt)
            break
        case 'none':
            break
        default:
            throw new Error(`지원하지 않는 mode: ${mode}`)
    }

    return instance
}

export default createTokenAxios
