export const weeks = ['월', '화', '수', '목', '금', '토', '일']

export const weekKeys = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
] as const

export type WeekKey = (typeof weekKeys)[number]
