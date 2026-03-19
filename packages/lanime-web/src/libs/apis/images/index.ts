import { useMutation } from '@tanstack/react-query'
import { instance } from '../axios'
import { IApiResponse } from '../../types/type'

export const useImageMutation = () => {
    const uploadImage = async (param: File) => {
        const formData = new FormData()
        formData.append('file', param)

        const { data } = await instance.post<IApiResponse<string>>(
            `/images/upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        )
        return data
    }

    return useMutation({
        mutationFn: uploadImage,
        mutationKey: ['images'],
    })
}
