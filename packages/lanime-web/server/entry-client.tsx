import { StrictMode } from 'react'
import App from '../src/App'
import { Provider } from 'react-redux'
import { store } from '../src/stores'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../src/libs/apis/queryClient'

const container = document.getElementById('root') as HTMLElement

const app = (
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Provider store={store}>
                    <App />
                </Provider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
)

const isDev = import.meta.env.MODE === 'development'

if (isDev) {
    // ✅ 개발 중엔 무조건 CSR로 돌리기
    createRoot(container).render(app)
} else {
    // ✅ 배포 모드에서는 SSR 결과에 따라 hydrateRoot 또는 createRoot
    const isUsingShaka = window.location.pathname.includes('/player')
    if (isUsingShaka) {
        createRoot(container).render(app) // 특정 라우트는 CSR
    } else {
        hydrateRoot(container, app) // 나머지는 SSR+hydrate
    }
}
