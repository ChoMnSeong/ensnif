import { createSlice } from '@reduxjs/toolkit'
import { action } from '@stores/auth/actions'
import { UserProfileState } from '@stores/auth/types'

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
