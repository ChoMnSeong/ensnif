import { PayloadAction } from '@reduxjs/toolkit'
import { UserProfileState } from '@stores/auth/types'

export const action = {
    setUserProfile: (
        state: UserProfileState,
        action: PayloadAction<UserProfileState>,
    ) => {
        state.avatarUrl = action.payload.avatarUrl
        state.nickname = action.payload.nickname
        state.profileId = action.payload.profileId
    },
}
