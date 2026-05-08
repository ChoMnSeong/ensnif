import axios from 'axios'
import tokenStorage from '@libs/tokenStorage'
import { env } from '@libs/env'

export const useReissue = async (refreshToken: string): Promise<void> => {
    try {
        const { data } = await axios.post(`${env.BASE_URL}/auth/refresh`, {
            refreshToken,
        })

        await tokenStorage.set.authToken(
            data.data.accessToken,
            undefined,
            data.data.expiresIn,
        )
    } catch (error) {
        console.error('Token reissue failed:', error)
        throw error
    }
}
