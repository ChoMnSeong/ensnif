export interface IUserProfile {
    profileId: string
    userId: string
    pin?: string
    name: string
    avatarUrl: string
    age?: number
    isOwner: boolean
    createdAt: string
    updatedAt: string
}

export interface IEmailCheckRequest {
    email: string
}

export interface IVerificationSendRequest {
    email: string
}

export interface IVerificationRequest {
    email: string
    code: string
}

export interface ISignupRequest {
    email: string
    password: string
    nickname: string
}

export interface ISigninRequest {
    email: string
    password: string
}

export interface IEmailCheckResponse {
    email: string
    isRegistered: boolean
}

export interface IAuthResponse {
    accessToken: string
    refreshToken?: string
    expiresIn: number
    tokenType: string
}

export interface IProfileCreateRequest {
    avatarUrl: string
    pin?: string
    nickname: string
}

export interface IProfilePinRequest {
    pin: string
}

export interface IProfileUpdateRequest {
    name?: string
    avatarUrl?: string
    age?: number
    pin?: string
}

export interface IProfileAccessResponse {
    isPasswordRequired: boolean
    profileToken?: string
}

export interface ISendEmailVerificationRequest {
    email: string
}

export interface IChangeEmailRequest {
    newEmail: string
    verificationCode: string
}

export interface IChangePasswordRequest {
    currentPassword: string
    newPassword: string
}

export interface IForgotPasswordRequest {
    email: string
}

export interface IResetPasswordRequest {
    email: string
    token: string
    newPassword: string
}

export interface IMyProfileResponse {
    profileId: string
    name: string
    avatarUrl: string
    isOwner: boolean
}

export interface IResetProfilePinRequest {
    password: string
}
