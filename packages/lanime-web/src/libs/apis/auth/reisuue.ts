import axios from 'axios'
import customCookie from '@libs/customCookie'

export const useReissue = async (refreshToken: string): Promise<void> => {
    try {
        const { data } = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
            { refreshToken },
        )

        customCookie.set.authToken(
            data.data.accessToken,
            undefined,
            data.data.expiresIn,
        )
    } catch (error) {
        console.error('Token reissue failed:', error)
        throw error
    }
}
