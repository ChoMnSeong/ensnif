import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, // 실패 시 1번만 재시도
            refetchOnWindowFocus: false, // 창 포커스 시 자동 갱신 끄기
            staleTime: 1000 * 60 * 5, // 5분간 데이터 유효 간주
        },
    },
})
