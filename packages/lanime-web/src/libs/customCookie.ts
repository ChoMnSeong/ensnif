import { Cookies } from 'react-cookie'

const cookies = new Cookies()

const customCookie = {
    get: {
        accessToken: () => cookies.get('access_token'),
        refreshToken: () => cookies.get('refresh_token'),
        profileToken: () => cookies.get('profile_token'),
    },
    set: {
        authToken: (
            accessToken: string,
            refreshToken: string | undefined,
            expiresIn: number,
        ) => {
            const accessExpireDate = new Date()
            accessExpireDate.setSeconds(
                accessExpireDate.getSeconds() + expiresIn,
            )

            cookies.set('access_token', accessToken, {
                expires: accessExpireDate,
                path: '/',
            })

            if (refreshToken) {
                const refreshExpireDate = new Date()
                refreshExpireDate.setDate(refreshExpireDate.getDate() + 5)

                cookies.set('refresh_token', refreshToken, {
                    expires: refreshExpireDate,
                    path: '/',
                })
            }
        },
        profileToken: (profileToken: string | undefined) => {
            if (profileToken) {
                cookies.set('profile_token', profileToken, {
                    path: '/',
                })
            }
        },
    },
    remove: {
        accessToken: () => cookies.remove('access_token', { path: '/' }),
        refreshToken: () => cookies.remove('refresh_token', { path: '/' }),
        profileToken: () => cookies.remove('profile_token', { path: '/' }),
    },
} as const

export default customCookie
