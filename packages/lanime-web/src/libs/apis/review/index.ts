import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { instance } from "../axios"
import { IReviewRequest } from "./type"
import toast from "react-hot-toast"

export const useWriteReviewMutation = (id: string) => {
  const querykey = ["campingDetail", id] as const
  const queryClient = useQueryClient()
  const response = async (content: IReviewRequest) => {
    const { data } = await instance.post(`/review/${id}`, content)
    return data
  }
  return useMutation({
    mutationKey: ["review", id],
    mutationFn: response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: querykey })
      toast.success("Review successfully written")
    },
    onError: () => {
      toast.error("Please after login")
    },
  })
}

export const useReviewedCampingQuery = () => {
  const response = async () => {
    const { data } = await instance.get(`/review`)
    return data
  }
  return useQuery({
    queryKey: ["ReviewedCamping"],
    queryFn: response,
  })
}
