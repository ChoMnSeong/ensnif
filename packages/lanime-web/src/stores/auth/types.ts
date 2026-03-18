export const SET_USER_PROFILE = 'SET_USER_PROFILE' as const

export interface UserProfileState {
    avatarUrl: string | null
    nickname: string | null
    profileId: string | null
}

export interface SetUserProfileAction {
    type: typeof SET_USER_PROFILE
    payload: UserProfileState
}

export type ProfileSelectAction = SetUserProfileAction
