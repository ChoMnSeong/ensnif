import { StrictMode } from 'react'
import App from '../src/App'
import { Provider } from 'react-redux'
import { store } from '../src/stores'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider, HydrationBoundary } from '@tanstack/react-query'
import { queryClient } from '../src/libs/apis/queryClient'

const container = document.getElementById('root')
if (!container) throw new Error('#root element not found')

// Consume SSR-dehydrated query state (set by entry-server.tsx)
// Falls back to undefined (= no hydration) when running as pure CSR
const dehydratedState = (window as unknown as Record<string, unknown>).__REACT_QUERY_STATE__

const app = (
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>
                <BrowserRouter>
                    <Provider store={store}>
                        <App />
                    </Provider>
                </BrowserRouter>
            </HydrationBoundary>
        </QueryClientProvider>
    </StrictMode>
)

// MODE(환경변수)가 아닌 DOM 상태로 판단:
// - SSR 서버(dev/prod 모두)가 렌더링했으면 #root에 실제 엘리먼트가 있음 → hydrateRoot
// - 순수 Vite CSR dev 서버면 #root에 <!--app-html--> 주석만 있음 → createRoot
// - /player 경로는 서버가 빈 템플릿을 그대로 내려보내므로 자동으로 createRoot 분기
const hasSSRContent = container.firstElementChild !== null

if (hasSSRContent) {
    hydrateRoot(container, app)
} else {
    createRoot(container).render(app)
}
