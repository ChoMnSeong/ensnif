export const env = {
    BASE_URL: import.meta.env.VITE_BASE_URL as string,
    TIMEOUT: Number(import.meta.env.VITE_TIME_OUT),
} as const
