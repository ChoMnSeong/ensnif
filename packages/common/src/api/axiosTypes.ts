import axios from 'axios'

export type AuthMode = 'jwt' | 'session' | 'none'

export interface JwtOptions {
    accessTokenGetter: () => string | null
    refreshTokenGetter: () => string | null
    useReissue: (refreshToken: string) => void
}

export interface TokenAxiosOptions {
    mode: AuthMode
    jwt?: JwtOptions
    axiosConfig?: Parameters<typeof axios.create>[0]
}
