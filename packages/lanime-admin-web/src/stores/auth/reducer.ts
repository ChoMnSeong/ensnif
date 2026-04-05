import { createSlice } from '@reduxjs/toolkit'
import type { IAdminAuthState } from '@stores/auth/types'

const initialState: IAdminAuthState = {
    isAuthenticated: !!localStorage.getItem('adminToken'),
}

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        login: (state) => {
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.isAuthenticated = false
        },
    },
})

export const { login, logout } = adminAuthSlice.actions
export default adminAuthSlice.reducer
