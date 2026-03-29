import { useQuery } from '@tanstack/react-query'
import { instance } from '@libs/apis/axios'
import { AdListResponse } from '@libs/apis/ad/type'
import { IApiResponse } from '@/libs/types/type'

export const useAdvertiseList = () => {
    const response = async () => {
        const { data } = await instance.get<IApiResponse<AdListResponse>>('ad')
        return data.data
    }
    return useQuery({
        queryKey: ['ad'],
        queryFn: response,
    })
}
