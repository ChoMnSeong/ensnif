import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { instance } from "../axios"
import { ICamping } from "../camping/type"

export const useLikePatchMutation = (id: string) => {
  const querykey = ["campingDetail", id] as const
  const queryClient = useQueryClient()

  const response = async () => {
    return await instance.patch(`/like/${id}`)
  }

  return useMutation({
    mutationFn: response,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: querykey })

      const previousData = queryClient.getQueryData<ICamping>(querykey)

      if (previousData) {
        const currentData = {
          ...previousData,
          isLiked: !previousData.like,
        }

        queryClient.setQueryData(querykey, currentData)

        return { previousData, currentData }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: querykey })
    },
    onError: (_error: any, _variables: any, context: any) => {
      if (context) {
        queryClient.setQueryData(querykey, context)
      }
    },
  })
}

export const useLikedCampingQuery = () => {
  const response = async () => {
    const { data } = await instance.get(`/like`)
    return data
  }
  return useQuery({ queryKey: ["likedCamping"], queryFn: response })
}
