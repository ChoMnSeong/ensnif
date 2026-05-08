import {
    lavender,
    blue,
    green,
    red,
    mono,
    orange,
    pink,
    teal,
    yellow,
    indigo,
} from './presets.js'
import type { Palette, PaletteName } from './types.js'

export * from './types.js'
export * from './neutral.js'
export * from './semantic.js'
export {
    lavender,
    blue,
    green,
    red,
    mono,
    orange,
    pink,
    teal,
    yellow,
    indigo,
}

export const palettes: Record<PaletteName, Palette> = {
    lavender,
    blue,
    green,
    red,
    mono,
    orange,
    pink,
    teal,
    yellow,
    indigo,
}

export const paletteNames: PaletteName[] = [
    'lavender',
    'blue',
    'green',
    'red',
    'mono',
    'orange',
    'pink',
    'teal',
    'yellow',
    'indigo',
]
