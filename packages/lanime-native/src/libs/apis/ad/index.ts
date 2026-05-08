import { useQuery } from '@tanstack/react-query'
import { instance } from '@libs/apis/axios'
import { AdListResponse } from './type'
import { IApiResponse } from '@libs/types/type'

export const useAdvertiseList = () => {
    return useQuery({
        queryKey: ['ad'],
        queryFn: async () => {
            const { data } =
                await instance.get<IApiResponse<AdListResponse[]>>('ad')
            return data.data
        },
    })
}
