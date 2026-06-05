import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DesignSystemProvider } from '@ensnif/design-system'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { SocketProvider } from './lib/socket'
import { router } from './App'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DesignSystemProvider variant="minimal" mode="dark" palette="green">
            <AuthProvider>
                <SocketProvider>
                    <RouterProvider router={router} />
                </SocketProvider>
            </AuthProvider>
        </DesignSystemProvider>
    </StrictMode>,
)
