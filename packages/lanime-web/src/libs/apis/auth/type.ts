// type.ts

// ==========================
// 도메인 모델 (UserProfile.kt 등)
// ==========================
export interface IUserProfile {
    profileId: string
    userId: string
    pin?: string
    name: string
    avatarUrl: string
    admin: boolean
    createdAt: string
    updatedAt: string
}

// ==========================
// Auth Requests
// ==========================
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

// ==========================
// Auth Responses
// ==========================
export interface IEmailCheckResponse {
    email: string
    registered: boolean
}

export interface IAuthResponse {
    accessToken: string
    refreshToken?: string
    expiresIn: number
    tokenType: string // 기본값: "Bearer"
}

// ==========================
// Profile Requests
// ==========================
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
    pin?: string
}

// ==========================
// Profile Responses
// ==========================
export interface IProfileAccessResponse {
    passwordRequired: boolean
    profileToken?: string
}
