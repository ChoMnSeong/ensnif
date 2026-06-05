import type { TableConfig } from '@ensnif/poker-engine'

/** Preset cash tables shown in the lobby. */
export const TABLE_CONFIGS: TableConfig[] = [
    {
        id: 'micro',
        name: '마이크로 — 5/10',
        smallBlind: 5,
        bigBlind: 10,
        maxSeats: 6,
        minBuyIn: 200,
        maxBuyIn: 2000,
    },
    {
        id: 'heads-up',
        name: '헤즈업 — 10/20',
        smallBlind: 10,
        bigBlind: 20,
        maxSeats: 2,
        minBuyIn: 400,
        maxBuyIn: 4000,
    },
    {
        id: 'low',
        name: '로우 — 25/50',
        smallBlind: 25,
        bigBlind: 50,
        maxSeats: 6,
        minBuyIn: 1000,
        maxBuyIn: 10000,
    },
    {
        id: 'high',
        name: '하이롤러 — 100/200',
        smallBlind: 100,
        bigBlind: 200,
        maxSeats: 9,
        minBuyIn: 4000,
        maxBuyIn: 40000,
    },
]
