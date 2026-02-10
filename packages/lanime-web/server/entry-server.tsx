import { renderToString } from 'react-dom/server'
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import createCache from '@emotion/cache'
import App from '../src/App'
import { StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../src/stores'

// types.ts 또는 현재 파일 상단에 정의해도 됩니다
export interface RenderedResult {
    html: string
    head?: string
    body?: string
}

export function entryServerRender(url: string): RenderedResult {
    const cache = createCache({ key: 'css' })
    const { extractCriticalToChunks, constructStyleTagsFromChunks } =
        createEmotionServer(cache)

    const app = (
        <CacheProvider value={cache}>
            <StaticRouter location={url}>
                <Provider store={store}>
                    <App />
                </Provider>
            </StaticRouter>
        </CacheProvider>
    )

    const html = renderToString(app)
    const chunks = extractCriticalToChunks(html)
    const styles = constructStyleTagsFromChunks(chunks)

    return {
        html,
        head: styles,
        body: html,
    }
}
