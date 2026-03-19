import { hydrateRoot } from 'react-dom/client'
import { loadableReady } from '@loadable/component'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './stores'
import { BrowserRouter } from 'react-router-dom'
import { queryClient } from './libs/apis/queryClient' // 위에서 만든 파일 임포트
import { QueryClientProvider } from '@tanstack/react-query'

const rootElement = document.getElementById('root')

if (rootElement) {
    loadableReady(() => {
        hydrateRoot(
            rootElement,
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </QueryClientProvider>
            </Provider>,
        )
    })
} else {
    console.error('Root element not found')
}
