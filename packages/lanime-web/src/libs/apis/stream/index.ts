import { instance } from '@libs/apis/axios'
import { IApiResponse } from '@/libs/types/type'

export interface StreamTicket {
    ticket: string
    expiresInSeconds: number
}

/**
 * 재생 티켓 발급. 플레이리스트·세그먼트·복호화 키 요청에 모두 필요하며
 * 수명이 짧아 재생 중에도 주기적으로 다시 받아야 한다.
 */
export const issueStreamTicket = async (
    episodeId: string,
): Promise<StreamTicket | null> => {
    const { data } = await instance.post<IApiResponse<StreamTicket>>(
        `/stream/${episodeId}/ticket`,
    )
    return data.data ?? null
}
