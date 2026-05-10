import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DesignSystemProvider } from '@ensnif/design-system'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DesignSystemProvider variant="glassmorphism" mode="dark" palette="indigo">
            <App />
        </DesignSystemProvider>
    </StrictMode>,
)
