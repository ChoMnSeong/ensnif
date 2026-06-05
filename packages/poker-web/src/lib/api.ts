import axios from 'axios'
import type { AuthResponse, PublicUser } from '@ensnif/poker-engine'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
})

/** Sets or clears the Authorization header used for all API calls. */
export function setAuthToken(token: string | null): void {
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`
    else delete api.defaults.headers.common.Authorization
}

/** Extracts a human-readable message from an axios error. */
export function apiError(err: unknown): string {
    if (axios.isAxiosError(err)) {
        return (err.response?.data as { error?: string } | undefined)?.error ?? '네트워크 오류가 발생했습니다'
    }
    return '알 수 없는 오류가 발생했습니다'
}

export const authApi = {
    async register(username: string, password: string): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/register', { username, password })
        return data
    },
    async login(username: string, password: string): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/login', { username, password })
        return data
    },
    async me(): Promise<PublicUser> {
        const { data } = await api.get<{ user: PublicUser }>('/me')
        return data.user
    },
}
