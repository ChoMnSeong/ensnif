/**
 * Deterministic, injectable random number generator.
 *
 * The engine never calls `Math.random` directly — callers pass an {@link Rng}
 * so that shuffles are reproducible in tests (seeded) while production uses a
 * real entropy source.
 */
export interface Rng {
    /** Returns a float in the half-open interval [0, 1). */
    next(): number
}

/** Small, fast, seedable PRNG (mulberry32). Great for reproducible tests. */
export function mulberry32(seed: number): Rng {
    let a = seed >>> 0
    return {
        next() {
            a = (a + 0x6d2b79f5) | 0
            let t = Math.imul(a ^ (a >>> 15), 1 | a)
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296
        },
    }
}

/** Production RNG backed by `Math.random`. */
export const mathRandomRng: Rng = {
    next: () => Math.random(),
}
