import type { Palette } from './types.js'
import {
    slateNeutral,
    zincNeutral,
    mauveNeutral,
    sageNeutral,
    oliveNeutral,
    sandNeutral,
} from './neutral.js'

export const lavender: Palette = {
    name: 'lavender',
    label: 'Lavender',
    primary: {
        50: '#f6f0ff',
        100: '#ecdcff',
        200: '#d9b9ff',
        300: '#c596ff',
        400: '#b473f9',
        500: '#a35def',
        600: '#8a45d4',
        700: '#7035ad',
        800: '#562984',
        900: '#3c1c5c',
    },
    neutral: mauveNeutral,
}

export const blue: Palette = {
    name: 'blue',
    label: 'Blue',
    primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
    },
    neutral: slateNeutral,
}

export const green: Palette = {
    name: 'green',
    label: 'Green',
    primary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
    },
    neutral: sageNeutral,
}

export const red: Palette = {
    name: 'red',
    label: 'Red',
    primary: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
    },
    neutral: sandNeutral,
}

export const mono: Palette = {
    name: 'mono',
    label: 'Mono',
    primary: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#a1a1aa',
        400: '#52525b',
        500: '#27272a',
        600: '#1f1f22',
        700: '#18181b',
        800: '#0f0f11',
        900: '#000000',
    },
    neutral: zincNeutral,
}

export const orange: Palette = {
    name: 'orange',
    label: 'Orange',
    primary: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
    },
    neutral: oliveNeutral,
}

export const pink: Palette = {
    name: 'pink',
    label: 'Pink',
    primary: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ec4899',
        600: '#db2777',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843',
    },
    neutral: mauveNeutral,
}

export const teal: Palette = {
    name: 'teal',
    label: 'Teal',
    primary: {
        50: '#f0fdfa',
        100: '#ccfbf1',
        200: '#99f6e4',
        300: '#5eead4',
        400: '#2dd4bf',
        500: '#14b8a6',
        600: '#0d9488',
        700: '#0f766e',
        800: '#115e59',
        900: '#134e4a',
    },
    neutral: sageNeutral,
}

export const yellow: Palette = {
    name: 'yellow',
    label: 'Yellow',
    primary: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#facc15',
        500: '#eab308',
        600: '#ca8a04',
        700: '#a16207',
        800: '#854d0e',
        900: '#713f12',
    },
    neutral: oliveNeutral,
}

export const indigo: Palette = {
    name: 'indigo',
    label: 'Indigo',
    primary: {
        50: '#eef2ff',
        100: '#e0e7ff',
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1',
        600: '#4f46e5',
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81',
    },
    neutral: slateNeutral,
}
