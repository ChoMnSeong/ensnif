import { useVideoPlayer, VideoView } from 'expo-video'
import { useEffect, useRef } from 'react'
import { View } from 'react-native'

interface Props {
    uri: string
    onProgress?: (seconds: number) => void
    startSeconds?: number
}

export const VideoPlayer = ({ uri, onProgress, startSeconds = 0 }: Props) => {
    const player = useVideoPlayer(uri, (p) => {
        p.loop = false
        if (startSeconds > 0) {
            p.currentTime = startSeconds
        }
        p.play()
    })

    const lastReportedRef = useRef(0)

    useEffect(() => {
        if (!onProgress) return
        const id = setInterval(() => {
            const t = player.currentTime
            if (Math.abs(t - lastReportedRef.current) >= 5) {
                lastReportedRef.current = t
                onProgress(t)
            }
        }, 1000)
        return () => clearInterval(id)
    }, [player, onProgress])

    return (
        <View style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' }}>
            <VideoView
                player={player}
                style={{ flex: 1 }}
                contentFit="contain"
                allowsFullscreen
                allowsPictureInPicture
            />
        </View>
    )
}
