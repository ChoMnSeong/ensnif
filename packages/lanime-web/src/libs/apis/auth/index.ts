import customCookie from "../../customCookie";
import axios from "axios";
import { instance } from "../axios";
import { useQuery } from "@tanstack/react-query";

export const useReissue = (refreshToken: string) => {
  axios
    .put(`${import.meta.env.VITE_BASE_URL}/auth/reissue`, null, {
      headers: {
        "Refresh-Token": `Bearer ${refreshToken}`,
      },
    })
    .then((e) =>
      customCookie.set.token(e.data.accessToken, e.data.refreshToken, "60"),
    )
    .catch((e) => console.log(e));
};

export const useProfileQuery = () => {
  const response = async () => {
    const { data } = await instance.get("/auth/profile");
    return data;
  };
  return useQuery({
    queryKey: ["profile"],
    queryFn: response,
    enabled: !!customCookie.get.accessToken(),
  });
};
