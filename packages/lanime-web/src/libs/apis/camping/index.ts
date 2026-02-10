"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { instance } from "../axios"
import { ICamping, ICampingResponse } from "./type"
import toast from "react-hot-toast"

export const useCampingListQuery = ({
  p,
  country,
  take,
  page,
}: {
  p?: string
  country: string
  take: number
  page: number
}) => {
  const response = async () => {
    const { data } = (
      await instance.get<{ data: ICampingResponse }>("camping", {
        params: { p, country, take, page },
      })
    ).data
    return data
  }
  return useQuery({ queryKey: [p, "campingList", country, page, take], queryFn: response })
}

export const useCampingDetailQuery = (id: string) => {
  const response = async () => {
    const { data } = (await instance.get<{ data: ICamping }>(`/camping/${id}`)).data
    return data
  }
  return useQuery({ queryKey: ["campingDetail", id], queryFn: response })
}

export const useCampingCreateMutation = () => {
  const response = async (param: Omit<ICamping, "like" | "like_count" | "reviews" | "recommend" | "campingID">) => {
    const { data } = await instance.post(`/camping`, param)
    return data
  }
  return useMutation({
    mutationFn: response,
    mutationKey: ["camping create"],
    onSuccess: () => {
      toast.success("Creation success")
    },
    onError: () => {
      toast.error("Please fill in all values")
    },
  })
}

export const useBestCampingQuery = () => {
  const response = async () => {
    const { data } = await instance.get(`/camping/best`)
    return data
  }

  return useQuery({ queryKey: ["best"], queryFn: response })
}
