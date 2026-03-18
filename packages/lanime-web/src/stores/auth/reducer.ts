import { createSlice } from '@reduxjs/toolkit'
import { action } from './actions'
import { UserProfileState } from './types'

const initialState: UserProfileState = {
    nickname: null,
    profileId: null,
    avatarUrl: null,
}

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: action,
})

export const { setUserProfile } = userProfileSlice.actions
export default userProfileSlice.reducer
