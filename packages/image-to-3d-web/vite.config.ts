import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        strictPort: true,
        proxy: {
            '/jobs': 'http://localhost:8000',
            '/artifacts': 'http://localhost:8000',
        },
    },
    build: {
        target: 'esnext',
        rollupOptions: {
            output: {
                manualChunks: {
                    'three-vendor': ['three'],
                    'react-vendor': ['react', 'react-dom'],
                },
            },
        },
    },
})
