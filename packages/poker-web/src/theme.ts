/**
 * Custom palette for the bespoke poker table (felt, rail, chips).
 * The rest of the UI uses the `@ensnif/design-system` minimal/dark theme via
 * its CSS variables (`--ds-color-*`, `--ds-radius-*`, etc.).
 */
export const FELT = {
    /** Center of the table felt. */
    table: '#1f6b4a',
    /** Outer felt gradient stop. */
    tableDark: '#155138',
    /** Wooden/leather rail around the felt. */
    rail: '#10231b',
    railEdge: '#0a160f',
    line: 'rgba(255,255,255,0.10)',
}

export const CHIP = {
    bet: '#e8c14a',
    pot: '#f0d678',
}

/** Design-system provider configuration (minimal design, per request). */
export const DS_THEME = { variant: 'minimal', mode: 'dark', palette: 'green' } as const
