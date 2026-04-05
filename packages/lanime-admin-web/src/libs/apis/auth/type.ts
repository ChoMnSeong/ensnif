export interface IAdminSigninRequest {
    email: string
    password: string
}

export interface IAdminAuthResponse {
    accessToken: string
    expiresIn: number
    tokenType: string
}
