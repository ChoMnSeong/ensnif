import { TokenAxiosOptions } from './axiosTypes'
import axios, { AxiosInstance } from 'axios'
import attachJwtInterceptor from './attachJwtInterceptor'
import attachSessionInterceptor from './attachSessionInterceptor'

const createTokenAxios = ({
    mode,
    jwt,
    axiosConfig,
}: TokenAxiosOptions): AxiosInstance => {
    // 1. 기본 인스턴스 생성
    const instance = axios.create({
        timeout: -1,
        headers: { 'Content-Type': 'application/json' },
        ...axiosConfig,
    })

    // 2. mode 별 인터셉터 부착
    switch (mode) {
        case 'session':
            attachSessionInterceptor(instance)
            break

        case 'jwt':
            if (!jwt) {
                throw new Error(
                    '`jwt` 옵션이 필요합니다. mode 가 "jwt" 일 때는 JwtOptions 를 전달해주세요.',
                )
            }
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
