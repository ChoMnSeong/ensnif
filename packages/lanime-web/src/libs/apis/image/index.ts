import { useMutation } from "@tanstack/react-query"
import { instance } from "../axios"
import { IImgResponse } from "./type"

export const useImageMutation = () => {
  const response = async (param: File) => {
    const formData = new FormData()
    formData.append("file", param)
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
    const { data } = await instance.post<IImgResponse>(`/image`, formData, config)
    return data
  }

  return useMutation({ mutationFn: response, mutationKey: ["image"] })
}
