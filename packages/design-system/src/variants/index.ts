import { minimal } from './minimal.js'
import { neumorphism } from './neumorphism.js'
import { glassmorphism } from './glassmorphism.js'
import { brutalism } from './brutalism.js'
import { retro } from './retro.js'
import type { VariantName, VariantSpec } from './types.js'

export * from './types.js'
export { minimal, neumorphism, glassmorphism, brutalism, retro }

export const variants: Record<VariantName, VariantSpec> = {
    minimal,
    neumorphism,
    glassmorphism,
    brutalism,
    retro,
}

export const variantNames: VariantName[] = [
    'minimal',
    'neumorphism',
    'glassmorphism',
    'brutalism',
    'retro',
]
