import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: ['@emotion/babel-plugin'],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@containers': path.resolve(__dirname, './src/containers'),
            '@hooks': path.resolve(__dirname, './src/libs/hooks'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@stores': path.resolve(__dirname, './src/stores'),
            '@libs': path.resolve(__dirname, './src/libs'),
            '@assets': path.resolve(__dirname, './src/assets'),
        },
    },
    ssr: {
        resolve: {
            // 기본 조건 순서: ['node', ...] → react-router-dom의 dist/index.js (CJS) 선택
            // import를 앞에 두면:             → react-router-dom의 dist/index.mjs (ESM) 선택
            // react 자체는 CJS만 존재하지만 Node.js가 ESM → CJS 임포트를 자동 처리함
            externalConditions: ['import', 'module-sync', 'node', 'default'],
        },
    },
    build: {
        minify: 'esbuild',
        // esnext: no legacy transforms/polyfills → smaller output
        target: 'esnext',
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'emotion-vendor': ['@emotion/react', '@emotion/styled'],
                    'query-vendor': ['@tanstack/react-query'],
                    'redux-vendor': ['react-redux', '@reduxjs/toolkit'],
                    // react-router was previously bundled into the main chunk
                    'router-vendor': ['react-router-dom'],
                    // shaka-player is ~4 MB; isolate so it only loads on /player routes
                    'shaka-vendor': ['shaka-player'],
                },
            },
        },
    },
})
