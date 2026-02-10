import { useQuery } from "@tanstack/react-query";
import { instance } from "../axios";
import { AdListResponse } from "./type";

export const useAdvertiseList = () => {
  const response = async () => {
    const { data } = await instance.get<AdListResponse>("ad");
    return data.data
  };
  return useQuery({
    queryKey: ["ad"],
    queryFn: response,
  });
};
