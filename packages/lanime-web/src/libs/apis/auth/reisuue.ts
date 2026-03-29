import axios from 'axios'
import customCookie from '@libs/customCookie'

export const useReissue = async (refreshToken: string): Promise<void> => {
    try {
        const e = await axios.put(
            `${import.meta.env.VITE_BASE_URL}/auth/reissue`,
            null,
            {
                headers: {
                    'Refresh-Token': `Bearer ${refreshToken}`,
                },
            },
        )

        customCookie.set.authToken(
            e.data.accessToken,
            e.data.refreshToken,
            e.data.expiresIn,
        )
    } catch (error) {
        console.error('Token reissue failed:', error)
        throw error
    }
}
