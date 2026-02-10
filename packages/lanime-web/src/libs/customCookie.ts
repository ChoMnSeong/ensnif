import { Cookies } from "react-cookie";

const cookies = new Cookies();

const customCookie = {
  get: {
    accessToken: () => cookies.get("access_token"),
    refreshToken: () => cookies.get("refresh_token"),
  },
  set: {
    token: (accessToken: string, refreshToken: string, expired_at: string) => {
      const date = new Date();
      date.setDate(date.getDate() + 5);

      cookies.set("access_token", accessToken, {
        expires: new Date(expired_at),
      });
      cookies.set("refresh_token", refreshToken, {
        expires: date,
      });
    },
  },
  remove: {
    accessToken: () => cookies.remove("access_token"),
    refreshToken: () => cookies.remove("refresh_token"),
  },
} as const;

export default customCookie;
