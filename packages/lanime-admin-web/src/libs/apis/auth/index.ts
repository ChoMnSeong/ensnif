import { useMutation } from '@tanstack/react-query'
import instance from "@libs/api/axios";
import type { IAdminSigninRequest, IAdminAuthResponse } from '@libs/apis/auth/type'

interface IApiResponse<T> {
    success: boolean
    data: T
}

export const useAdminSignin = () =>
    useMutation({
        mutationFn: async (data: IAdminSigninRequest): Promise<IAdminAuthResponse> => {
            const res = await instance.post<IApiResponse<IAdminAuthResponse>>('/admin/auth/signin', data)
            return res.data.data
        },
    })
