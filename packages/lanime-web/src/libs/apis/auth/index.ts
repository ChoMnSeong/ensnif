// index.ts
import customCookie from '../../customCookie'
import axios from 'axios'
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
} from './type'

import { IApiResponse } from '../../types/type'

// ==========================================
// 토큰 재발급 (기존 로직 유지)
// ==========================================
// packages/lanime-web/src/libs/apis/auth/index.ts

export const useReissue = async (refreshToken: string): Promise<void> => {
    try {
        const e = await axios.put(
            `${import.meta.env.VITE_BASE_URL}/auth/reissue`,
            null,
            {
                headers: {
                    'Refresh-Token': `Bearer ${refreshToken}`,
                },
            },
        )

        customCookie.set.authToken(
            e.data.accessToken,
            e.data.refreshToken,
            e.data.expiresIn,
        )
    } catch (error) {
        console.error('Token reissue failed:', error)
        // 에러 발생 시 공통 로직에서 에러를 인지할 수 있도록 그대로 던집니다.
        throw error
    }
}

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
        const { data } = await instance.get<IUserProfile[]>('/profiles')
        return data
    }
    return useQuery({
        queryKey: ['profiles'],
        queryFn: fetchProfiles,
        enabled: !!customCookie.get.accessToken(),
    })
}

// 프로필 진입 (PIN 체크 여부)
export const useCheckProfileAccessMutation = (profileId: string) => {
    return useMutation({
        mutationFn: async () => {
            const { data } = await instance.post<
                IApiResponse<IProfileAccessResponse>
            >(`/profiles/${profileId}/access`)
            return data.data
        },
    })
}

// 프로필 PIN 검증
export const useVerifyProfilePinMutation = (profileId: string) => {
    return useMutation({
        mutationFn: async (request: IProfilePinRequest) => {
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
