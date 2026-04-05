import { configureStore } from '@reduxjs/toolkit'
import { adminAuthReducer } from '@stores/auth'

export const store = configureStore({
    reducer: {
        adminAuth: adminAuthReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
