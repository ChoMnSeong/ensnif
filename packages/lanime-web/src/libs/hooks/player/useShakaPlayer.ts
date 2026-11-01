import { useEffect, useRef, useState, useCallback } from 'react'
import shaka from 'shaka-player'
import customCookie from '@libs/customCookie'
import { issueStreamTicket } from '@libs/apis/stream'

/** 'auto'는 ABR(자동 화질 조절)에 맡긴다는 뜻. 숫자는 고정할 세로 해상도. */
export type QualitySelection = number | 'auto'

export interface QualityOption {
    height: number
    label: string
}

// shaka 타입 선언(global.d.ts의 export = shaka)으로는 extern 네임스페이스가
// any로 잡히므로, 여기서 쓰는 필드만 최소한으로 정의해 쓴다.
interface VariantTrack {
    id: number
    active: boolean
    bandwidth: number
    height: number | null
}

const getVariantTracks = (player: shaka.Player): VariantTrack[] =>
    player.getVariantTracks() as VariantTrack[]

interface ShakaRequest {
    headers: Record<string, string>
    uris: string[]
}

// 티켓 만료 직전에 미리 갱신해 재생이 끊기지 않게 한다.
const TICKET_RENEW_MARGIN_MS = 20_000

const withTicket = (uri: string, ticket: string) => {
    if (uri.includes('t=')) return uri
    return `${uri}${uri.includes('?') ? '&' : '?'}t=${encodeURIComponent(ticket)}`
}

/**
 * 스트림 API는 인증 + 재생 티켓을 요구한다. shaka는 axios 인스턴스를 타지 않고
 * 직접 요청하므로, 매니페스트·세그먼트·복호화 키 요청마다 여기서 붙여준다.
 */
const attachStreamCredentials = (player: shaka.Player, episodeId: string) => {
    const engine = player.getNetworkingEngine()
    if (!engine) return

    let cached: { token: string; expiresAt: number } | null = null
    let pending: Promise<string | null> | null = null

    const ensureTicket = async (): Promise<string | null> => {
        if (cached && cached.expiresAt - Date.now() > TICKET_RENEW_MARGIN_MS) {
            return cached.token
        }
        if (pending) return pending

        pending = issueStreamTicket(episodeId)
            .then((issued) => {
                if (!issued) return null
                cached = {
                    token: issued.ticket,
                    expiresAt: Date.now() + issued.expiresInSeconds * 1000,
                }
                return cached.token
            })
            .catch(() => null)
            .finally(() => {
                pending = null
            })

        return pending
    }

    engine.registerRequestFilter(
        async (_type: unknown, request: ShakaRequest) => {
            const accessToken = customCookie.get.accessToken()
            const profileToken = customCookie.get.profileToken()

            if (accessToken)
                request.headers.Authorization = `Bearer ${accessToken}`
            if (profileToken) request.headers['X-Profile-Token'] = profileToken

            const ticket = await ensureTicket()
            if (ticket) {
                request.uris = request.uris.map((uri) =>
                    withTicket(uri, ticket),
                )
            }
        },
    )
}

// 같은 높이를 가진 트랙(코덱/비트레이트 차이)은 하나로 합치고 높은 순으로 정렬한다.
const toQualityOptions = (tracks: VariantTrack[]): QualityOption[] => {
    const heights = tracks
        .map((track) => track.height)
        .filter(
            (height): height is number =>
                typeof height === 'number' && height > 0,
        )

    return [...new Set(heights)]
        .sort((a, b) => b - a)
        .map((height) => ({ height, label: `${height}p` }))
}

export const useShakaPlayer = (
    videoRef: React.RefObject<HTMLVideoElement | null>,
    src: string,
    episodeId: string,
) => {
    const shakaPlayerRef = useRef<shaka.Player | null>(null)
    const [qualities, setQualities] = useState<QualityOption[]>([])
    const [selectedQuality, setSelectedQuality] =
        useState<QualitySelection>('auto')
    // ABR이 실제로 재생 중인 화질. '자동 (1080p)'처럼 보조 표기에 쓴다.
    const [activeQualityHeight, setActiveQualityHeight] = useState<
        number | null
    >(null)

    useEffect(() => {
        const video = videoRef.current
        if (!video || !src) return

        const player = new shaka.Player(video)
        shakaPlayerRef.current = player
        attachStreamCredentials(player, episodeId)

        setQualities([])
        setSelectedQuality('auto')
        setActiveQualityHeight(null)

        // 트랙 목록과 현재 재생 화질을 플레이어 상태에서 다시 읽어온다.
        const syncTracks = () => {
            const tracks = getVariantTracks(player)
            setQualities(toQualityOptions(tracks))
            setActiveQualityHeight(
                tracks.find((track) => track.active)?.height ?? null,
            )
        }

        // trackschanged: 매니페스트 갱신, adaptation/variantchanged: 재생 화질 전환
        player.addEventListener('trackschanged', syncTracks)
        player.addEventListener('adaptation', syncTracks)
        player.addEventListener('variantchanged', syncTracks)

        player
            .load(src)
            .then(syncTracks)
            // 언마운트/소스 교체로 로드가 중단되면 거부되므로 조용히 넘긴다.
            .catch(() => {})

        const handlePageHide = (e: PageTransitionEvent) => {
            if (e.persisted) {
                player.destroy()
                shakaPlayerRef.current = null
            }
        }
        window.addEventListener('pagehide', handlePageHide)

        return () => {
            window.removeEventListener('pagehide', handlePageHide)
            player.removeEventListener('trackschanged', syncTracks)
            player.removeEventListener('adaptation', syncTracks)
            player.removeEventListener('variantchanged', syncTracks)
            player.destroy()
            shakaPlayerRef.current = null
        }
    }, [videoRef, src, episodeId])

    const selectQuality = useCallback((selection: QualitySelection) => {
        const player = shakaPlayerRef.current
        if (!player) return

        if (selection === 'auto') {
            player.configure({ abr: { enabled: true } })
            setSelectedQuality('auto')
            return
        }

        // 같은 화질에 여러 트랙이 있으면 대역폭이 가장 높은 쪽을 고른다.
        const track = getVariantTracks(player)
            .filter((t) => t.height === selection)
            .sort((a, b) => b.bandwidth - a.bandwidth)[0]
        if (!track) return

        player.configure({ abr: { enabled: false } })
        // clearBuffer=true: 이미 받아둔 버퍼를 비워 즉시 새 화질로 전환한다.
        player.selectVariantTrack(track, true)

        setSelectedQuality(selection)
        setActiveQualityHeight(selection)
    }, [])

    return {
        shakaPlayerRef,
        qualities,
        selectedQuality,
        activeQualityHeight,
        selectQuality,
    }
}
