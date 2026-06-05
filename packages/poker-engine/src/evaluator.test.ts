import { describe, expect, it } from 'vitest'
import { cardFromString } from './cards'
import { HandCategory, compareHandValue, evaluateBest, rankFiveCards } from './evaluator'

const hand = (s: string) => s.split(' ').map(cardFromString)

describe('rankFiveCards', () => {
    it('classifies each category', () => {
        expect(rankFiveCards(hand('As Ks Qs Js Ts')).category).toBe(HandCategory.StraightFlush)
        expect(rankFiveCards(hand('9h 9c 9d 9s 2c')).category).toBe(HandCategory.FourOfAKind)
        expect(rankFiveCards(hand('Kh Kc Kd 5s 5h')).category).toBe(HandCategory.FullHouse)
        expect(rankFiveCards(hand('Ah 9h 6h 3h 2h')).category).toBe(HandCategory.Flush)
        expect(rankFiveCards(hand('9h 8c 7d 6s 5h')).category).toBe(HandCategory.Straight)
        expect(rankFiveCards(hand('7h 7c 7d 9s 2c')).category).toBe(HandCategory.ThreeOfAKind)
        expect(rankFiveCards(hand('Jh Jc 4d 4s 9c')).category).toBe(HandCategory.TwoPair)
        expect(rankFiveCards(hand('Qh Qc 9d 5s 2c')).category).toBe(HandCategory.Pair)
        expect(rankFiveCards(hand('Ah Jc 9d 5s 2c')).category).toBe(HandCategory.HighCard)
    })

    it('treats the wheel as a 5-high straight', () => {
        const wheel = rankFiveCards(hand('Ah 2c 3d 4s 5h'))
        expect(wheel.category).toBe(HandCategory.Straight)
        expect(wheel.tiebreak[0]).toBe(5)
        // A 6-high straight beats the wheel.
        const sixHigh = rankFiveCards(hand('6h 2c 3d 4s 5h'))
        expect(compareHandValue(sixHigh, wheel)).toBeGreaterThan(0)
    })

    it('compares kickers correctly', () => {
        const aceKing = rankFiveCards(hand('Ah Ac Kd 5s 2c'))
        const aceQueen = rankFiveCards(hand('As Ad Qh 5c 2d'))
        expect(compareHandValue(aceKing, aceQueen)).toBeGreaterThan(0)
    })

    it('ranks flush above straight and below full house', () => {
        const straight = rankFiveCards(hand('9h 8c 7d 6s 5h'))
        const flush = rankFiveCards(hand('Ah 9h 6h 3h 2h'))
        const boat = rankFiveCards(hand('Kh Kc Kd 5s 5h'))
        expect(compareHandValue(flush, straight)).toBeGreaterThan(0)
        expect(compareHandValue(boat, flush)).toBeGreaterThan(0)
    })
})

describe('evaluateBest', () => {
    it('finds the best 5 of 7 cards', () => {
        // 2 hole + 5 board, best hand is a flush.
        const best = evaluateBest(hand('Ah Kh Qh 7h 2h 3c 4d'))
        expect(best.category).toBe(HandCategory.Flush)
        expect(best.cards).toHaveLength(5)
    })

    it('detects a straight using both hole cards and the board', () => {
        const best = evaluateBest(hand('5h 6c 7d 8s 9h Kc 2d'))
        expect(best.category).toBe(HandCategory.Straight)
        expect(best.tiebreak[0]).toBe(9)
    })

    it('prefers the higher full house over trips', () => {
        const best = evaluateBest(hand('Ah Ac Ad Kh Kc 2d 3s'))
        expect(best.category).toBe(HandCategory.FullHouse)
        expect(best.tiebreak).toEqual([14, 13])
    })
})
