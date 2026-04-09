import { renderToString } from 'react-dom/server'
import '../src/libs/i18n'
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import createCache from '@emotion/cache'
import App from '../src/App'
import { StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../src/stores'
import { QueryClient, QueryClientProvider, dehydrate } from '@tanstack/react-query'

export interface RenderedResult {
    html: string
    head?: string
}

// JSON-safe serialization: prevent </script> injection
function safeJsonStringify(value: unknown): string {
    return JSON.stringify(value)
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026')
}

export async function entryServerRender(url: string): Promise<RenderedResult> {
    // 요청마다 새 QueryClient 생성: 서버 간 상태 공유 방지
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: Infinity,
            },
        },
    })

    // Prefetch ad list: breaks the JS→API→image request waterfall
    // The first item's image is the LCP element on the home page
    type AdItem = { webImageURL: string }
    const adList: AdItem[] = await fetch(`${import.meta.env.VITE_BASE_URL}/ad`)
        .then((r) => r.json())
        .then((j: { data: AdItem[] }) => j.data ?? [])
        .catch(() => [])

    if (adList.length > 0) {
        // Pre-populate cache so client skips the ad API request entirely
        queryClient.setQueryData(['ad'], adList)
    }

    const lcpImageUrl = adList[0]?.webImageURL

    const cache = createCache({ key: 'css' })
    const { extractCriticalToChunks, constructStyleTagsFromChunks } =
        createEmotionServer(cache)

    const app = (
        <QueryClientProvider client={queryClient}>
            <CacheProvider value={cache}>
                <StaticRouter location={url}>
                    <Provider store={store}>
                        <App />
                    </Provider>
                </StaticRouter>
            </CacheProvider>
        </QueryClientProvider>
    )

    const html = renderToString(app)
    const chunks = extractCriticalToChunks(html)
    const styles = constructStyleTagsFromChunks(chunks)

    // Dehydrate for client-side HydrationBoundary
    const dehydratedState = dehydrate(queryClient)
    queryClient.clear()

    const headParts: string[] = [
        // Preload LCP image: browser fetches it in parallel with JS parse
        lcpImageUrl
            ? `<link rel="preload" as="image" href="${lcpImageUrl}" fetchpriority="high" />`
            : '',
        styles,
        // Embed dehydrated state for HydrationBoundary in entry-client.tsx
        `<script>window.__REACT_QUERY_STATE__ = ${safeJsonStringify(dehydratedState)}</script>`,
    ]

    return {
        html,
        head: headParts.filter(Boolean).join('\n'),
    }
}
