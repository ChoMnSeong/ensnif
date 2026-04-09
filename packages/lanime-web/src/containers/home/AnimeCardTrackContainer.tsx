import React from 'react'
import { useAnimeCardTrack } from '@components/home/hook/useTrackMove'
import AnimeCardTrackLayout from '@components/home/AnimeCardTrackLayout'

interface AnimeCardTrackContainerProps {
    children: React.ReactNode
    length: number
}

const AnimeCardTrackContainer: React.FC<AnimeCardTrackContainerProps> = ({
    children,
    length,
}) => {
    // We use the most granular move amount (mobile: 1) to determine the absolute maximum possible state.
    // However, since CSS moves by 4 (desktop) or 1 (mobile), we need to ensure maxIndex covers the needs of all viewports.
    // For Desktop (move by 4), maxIndex is roughly (length - 5) / 4.
    // For Mobile (move by 1), maxIndex is roughly (length - 2) / 1.
    // We'll set a high maxIndex and rely on CSS/behavior to look correct, 
    // but a better way is to provide a length that allows enough "clicks" for the smallest move amount.
    const maxIndex = Math.max(0, length - 1)

    const { state, onNext, onPrev, hasPrev, hasNext } =
        useAnimeCardTrack(maxIndex)

    return (
        <AnimeCardTrackLayout
            state={state}
            hasPrev={hasPrev}
            hasNext={hasNext && (state + 1) * 3 < length} // Desktop move-amount is 3
            onNext={onNext}
            onPrev={onPrev}
        >
            {children}
        </AnimeCardTrackLayout>
    )
}

export default AnimeCardTrackContainer
