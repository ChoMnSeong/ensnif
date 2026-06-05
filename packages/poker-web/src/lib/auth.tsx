import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { PublicUser } from '@ensnif/poker-engine'
import { authApi, setAuthToken } from './api'

const TOKEN_KEY = 'poker.token'

interface AuthContextValue {
    user: PublicUser | null
    token: string | null
    loading: boolean
    login(username: string, password: string): Promise<void>
    register(username: string, password: string): Promise<void>
    logout(): void
    /** Re-fetch the current user (e.g. to refresh the chip balance). */
    refresh(): Promise<void>
    setUser(user: PublicUser): void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
    const [user, setUser] = useState<PublicUser | null>(null)
    const [loading, setLoading] = useState(true)

    // Keep the axios header in sync with the token.
    useEffect(() => {
        setAuthToken(token)
    }, [token])

    // On boot (or token change), validate the session by loading the profile.
    useEffect(() => {
        let cancelled = false
        if (!token) {
            setUser(null)
            setLoading(false)
            return
        }
        setLoading(true)
        authApi
            .me()
            .then((u) => {
                if (!cancelled) setUser(u)
            })
            .catch(() => {
                if (!cancelled) {
                    localStorage.removeItem(TOKEN_KEY)
                    setToken(null)
                    setUser(null)
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [token])

    const apply = useCallback((res: { token: string; user: PublicUser }) => {
        localStorage.setItem(TOKEN_KEY, res.token)
        setToken(res.token)
        setUser(res.user)
    }, [])

    const login = useCallback(
        async (username: string, password: string) => {
            apply(await authApi.login(username, password))
        },
        [apply],
    )

    const register = useCallback(
        async (username: string, password: string) => {
            apply(await authApi.register(username, password))
        },
        [apply],
    )

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
    }, [])

    const refresh = useCallback(async () => {
        try {
            setUser(await authApi.me())
        } catch {
            /* ignore */
        }
    }, [])

    const value = useMemo<AuthContextValue>(
        () => ({ user, token, loading, login, register, logout, refresh, setUser }),
        [user, token, loading, login, register, logout, refresh],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
    return ctx
}
