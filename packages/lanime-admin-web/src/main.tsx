import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@libs/i18n'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from '@stores/index'
import { queryClient } from '@libs/apis/queryClient'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
)
