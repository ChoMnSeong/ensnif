import { useCallback, useEffect, useState } from 'react'
import { isRouteId, type RouteId } from './routes'

const DEFAULT_ROUTE: RouteId = 'introduction'

const readHash = (): RouteId => {
    if (typeof window === 'undefined') return DEFAULT_ROUTE
    const raw = window.location.hash.replace(/^#\/?/, '')
    return isRouteId(raw) ? raw : DEFAULT_ROUTE
}

export const useRouter = () => {
    const [route, setRouteState] = useState<RouteId>(() => readHash())

    useEffect(() => {
        const onChange = () => setRouteState(readHash())
        window.addEventListener('hashchange', onChange)
        return () => window.removeEventListener('hashchange', onChange)
    }, [])

    const setRoute = useCallback((next: RouteId) => {
        if (typeof window !== 'undefined') {
            window.location.hash = `/${next}`
        }
        setRouteState(next)
    }, [])

    return { route, setRoute }
}
