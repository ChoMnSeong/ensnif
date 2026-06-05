import type { CommunityCardsProps } from './props'
import { CardView } from './CardView'

/** Fixed-size board: 5 slots, revealed cards filled left-to-right. */
const SLOT_COUNT = 5

/** Matches the `md` CardView footprint so placeholders align with real cards. */
const MD_CARD: { width: number; height: number } = { width: 48, height: 68 }

export function CommunityCards({ board }: CommunityCardsProps) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
            }}
        >
            {Array.from({ length: SLOT_COUNT }, (_, i) => {
                const card = board[i]
                if (card) {
                    return <CardView key={i} card={card} size="md" />
                }
                return (
                    <div
                        key={i}
                        aria-hidden
                        style={{
                            width: MD_CARD.width,
                            height: MD_CARD.height,
                            border: '1px dashed var(--ds-color-border-subtle)',
                            borderRadius: 'var(--ds-radius-sm)',
                            background: 'var(--ds-color-background-inset)',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.25)',
                        }}
                    />
                )
            })}
        </div>
    )
}
