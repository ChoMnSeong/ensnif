import { hydrateRoot } from 'react-dom/client'
import { loadableReady } from '@loadable/component'
import '@libs/i18n'
import App from '@/App'
import { Provider } from 'react-redux'
import { store } from '@stores'
import { BrowserRouter } from 'react-router-dom'
import { queryClient } from '@libs/apis/queryClient'
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
