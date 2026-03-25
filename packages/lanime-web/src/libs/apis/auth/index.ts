// index.ts
import customCookie from '../../customCookie'
import { instance } from '../axios' // Axios 인스턴스 (Base URL 포함되어 있다고 가정)
import { useQuery, useMutation } from '@tanstack/react-query'
import {
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
} from './type'

import { IApiResponse } from '../../types/type'

// ==========================================
// Auth 관련 Mutations (AuthController.kt)
// ==========================================

export const useCheckEmailMutation = () => {
    return useMutation({
        mutationFn: async (request: IEmailCheckRequest) => {
            const { data } = await instance.post<
                IApiResponse<IEmailCheckResponse>
            >('/auth/check-email', request)
            return data.data // IEmailCheckResponse 반환
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
            return data // message("인증 번호가 이메일로 발송되었습니다.") 확인을 위해 전체 response 반환
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
            return data.data // boolean 반환
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

// ==========================================
// Profile 관련 Queries & Mutations (ProfileController.kt)
// ==========================================

// 프로필 목록 조회
export const useProfilesQuery = () => {
    const fetchProfiles = async () => {
        // 백엔드에서 Flux<UserProfile>를 바로 반환하므로 배열 형태
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

// 프로필 진입 (PIN 체크 여부)
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

// 프로필 PIN 검증
// 수정 후: profileId와 request(pin)를 객체로 묶어서 받음
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

// 프로필 생성
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

// 현재 접속 중인 프로필 정보 조회 (새로고침 시 Redux 상태 복구용)
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

// 현재 접속된 프로필 수정
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
