// packages/common/src/api/axiosTypes.ts 수정

import axios, { AxiosRequestConfig } from 'axios'

export type AuthMode = 'jwt' | 'session' | 'none'

export interface JwtOptions {
    accessTokenGetter: () => string | null
    refreshTokenGetter: () => string | null
    useReissue: (refreshToken: string) => Promise<void>
}

// 동적 설정을 위한 타입 추가
export type DynamicConfigResolver = (
    config: AxiosRequestConfig,
) => AxiosRequestConfig | Promise<AxiosRequestConfig>

export interface TokenAxiosOptions {
    mode: AuthMode
    jwt?: JwtOptions
    axiosConfig?: AxiosRequestConfig
    // 모든 설정을 커스텀할 수 있는 리졸버 추가
    configResolver?: DynamicConfigResolver
}
