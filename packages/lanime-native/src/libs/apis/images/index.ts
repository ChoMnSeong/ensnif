import { useMutation } from '@tanstack/react-query'
import { instance } from '@libs/apis/axios'
import { IApiResponse } from '@libs/types/type'

export interface ImageUploadAsset {
    uri: string
    name?: string
    type?: string
}

export const useImageMutation = () => {
    return useMutation({
        mutationKey: ['images'],
        mutationFn: async (asset: ImageUploadAsset) => {
            const formData = new FormData()
            formData.append('file', {
                uri: asset.uri,
                name: asset.name ?? 'upload.jpg',
                type: asset.type ?? 'image/jpeg',
            } as unknown as Blob)

            const { data } = await instance.post<IApiResponse<string>>(
                '/images/upload',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } },
            )
            return data
        },
    })
}
