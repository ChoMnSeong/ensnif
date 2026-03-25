import axios from 'axios'
import customCookie from '../../customCookie'

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
        // 에러 발생 시 공통 로직에서 에러를 인지할 수 있도록 그대로 던집니다.
        throw error
    }
}
