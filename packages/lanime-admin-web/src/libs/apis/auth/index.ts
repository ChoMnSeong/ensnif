import api from '@/libs/axios'

export interface IAdminSigninRequest {
    email: string
    password: string
}

export interface IAdminAuthResponse {
    accessToken: string
    expiresIn: number
    tokenType: string
}

export const adminSignin = async (data: IAdminSigninRequest): Promise<IAdminAuthResponse> => {
    const res = await api.post<{ success: boolean; data: IAdminAuthResponse }>('/admin/auth/signin', data)
    return res.data.data
}
