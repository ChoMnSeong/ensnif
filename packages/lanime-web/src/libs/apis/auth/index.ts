import customCookie from '@libs/customCookie'
import { instance } from '@libs/apis/axios'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
    ISendEmailVerificationRequest,
    IChangeEmailRequest,
    IChangePasswordRequest,
    IForgotPasswordRequest,
    IResetPasswordRequest,
    IEmailCheckRequest,
    IEmailCheckResponse,
    IVerificationSendRequest,
    IVerificationRequest,
    ISignupRequest,
    ISigninRequest,
    IAuthResponse,
    IUserProfile,
    IProfileCreateRequest,
    IProfilePinRequest,
    IProfileUpdateRequest,
    IProfileAccessResponse,
    IMyProfileResponse,
} from '@libs/apis/auth/type'

import { IApiResponse } from '@libs/types/type'

export const useCheckEmailMutation = () => {
    return useMutation({
        mutationFn: async (request: IEmailCheckRequest) => {
            const { data } = await instance.post<
                IApiResponse<IEmailCheckResponse>
            >('/auth/check-email', request)
            return data.data
        },
    })
}

export const useSendVerificationMutation = () => {
    return useMutation({
        mutationFn: async (request: IVerificationSendRequest) => {
            const { data } = await instance.post<IApiResponse<void>>(
                '/auth/send-verification',
                request,
            )
            return data
        },
    })
}

export const useVerifyCodeMutation = () => {
    return useMutation({
        mutationFn: async (request: IVerificationRequest) => {
            const { data } = await instance.post<IApiResponse<boolean>>(
                '/auth/verify-code',
                request,
            )
            return data.data
        },
    })
}

export const useSignupMutation = () => {
    return useMutation({
        mutationFn: async (request: ISignupRequest) => {
            const { data } = await instance.post<IApiResponse<void>>(
                '/auth/signup',
                request,
            )
            return data
        },
    })
}

export const useSigninMutation = () => {
    return useMutation({
        mutationFn: async (request: ISigninRequest) => {
            const { data } = await instance.post<IApiResponse<IAuthResponse>>(
                '/auth/signin',
                request,
            )
            return data.data
        },
        onSuccess: (authResponse) => {
            if (authResponse?.accessToken && authResponse?.refreshToken) {
                customCookie.set.authToken(
                    authResponse.accessToken,
                    authResponse.refreshToken,
                    authResponse.expiresIn,
                )
            }
        },
    })
}

export const useProfilesQuery = () => {
    const fetchProfiles = async () => {
        const { data } =
            await instance.get<IApiResponse<IUserProfile[]>>('/profiles')
        return data.data
    }
    return useQuery({
        queryKey: ['profiles'],
        queryFn: fetchProfiles,
        enabled: !!customCookie.get.accessToken(),
    })
}

export const useCheckProfileAccessMutation = () => {
    return useMutation({
        mutationFn: async (profileId: string) => {
            const { data } = await instance.post<
                IApiResponse<IProfileAccessResponse>
            >(`/profiles/${profileId}/access`)
            return data.data
        },
    })
}

export const useVerifyProfilePinMutation = () => {
    return useMutation({
        mutationFn: async ({
            profileId,
            request,
        }: {
            profileId: string
            request: IProfilePinRequest
        }) => {
            const { data } = await instance.post<
                IApiResponse<IProfileAccessResponse>
            >(`/profiles/${profileId}/verify`, request)
            return data.data
        },
    })
}

export const useCreateProfileMutation = () => {
    return useMutation({
        mutationFn: async (request: IProfileCreateRequest) => {
            const { data } = await instance.post<IApiResponse<void>>(
                '/profiles',
                request,
            )
            return data
        },
    })
}

export const useMyProfileQuery = (options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ['myProfile'],
        queryFn: async () => {
            const { data } =
                await instance.get<IApiResponse<IMyProfileResponse>>(
                    '/profiles/self',
                )
            return data.data
        },
        enabled: options?.enabled ?? !!customCookie.get.profileToken(),
        staleTime: Infinity,
    })
}

export const useUpdateProfileMutation = () => {
    return useMutation({
        mutationFn: async (request: IProfileUpdateRequest) => {
            const { data } = await instance.patch<IApiResponse<void>>(
                '/profiles/self',
                request,
            )
            return data
        },
    })
}

export const useDeleteAccountMutation = () => {
    return useMutation({
        mutationFn: async () => {
            const { data } =
                await instance.delete<IApiResponse<void>>('/auth/account')
            return data
        },
    })
}

export const useSendEmailVerificationMutation = () => {
    return useMutation({
        mutationFn: async (request: ISendEmailVerificationRequest) => {
            const { data } = await instance.post<IApiResponse<void>>(
                '/auth/account/email/send-verification',
                request,
            )
            return data
        },
    })
}

export const useChangeEmailMutation = () => {
    return useMutation({
        mutationFn: async (request: IChangeEmailRequest) => {
            const { data } = await instance.patch<IApiResponse<void>>(
                '/auth/account/email',
                request,
            )
            return data
        },
    })
}

export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: async (request: IChangePasswordRequest) => {
            const { data } = await instance.patch<IApiResponse<void>>(
                '/auth/account/password',
                request,
            )
            return data
        },
    })
}

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: async (request: IForgotPasswordRequest) => {
            const { data } = await instance.post<IApiResponse<void>>(
                '/auth/forgot-password',
                request,
            )
            return data
        },
    })
}

export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: async (request: IResetPasswordRequest) => {
            const { data } = await instance.post<IApiResponse<void>>(
                '/auth/reset-password',
                request,
            )
            return data
        },
    })
}

export const useDeleteProfileMutation = () => {
    return useMutation({
        mutationFn: async (profileId: string) => {
            const { data } = await instance.delete<IApiResponse<void>>(
                `/profiles/${profileId}`,
            )
            return data
        },
    })
}
