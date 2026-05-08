export type RadiusTokens = {
    none: string
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    full: string
}

export type ShadowTokens = {
    none: string
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    inner: string
    glow: string
}

export type SpacingTokens = {
    0: string
    1: string
    2: string
    3: string
    4: string
    5: string
    6: string
    8: string
    10: string
    12: string
    16: string
    20: string
    24: string
    32: string
}

export type TypographyTokens = {
    fontFamily: {
        sans: string
        serif: string
        mono: string
        display: string
    }
    fontSize: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
        '4xl': string
        '5xl': string
    }
    fontWeight: {
        regular: string
        medium: string
        semibold: string
        bold: string
        black: string
    }
    lineHeight: {
        tight: string
        normal: string
        relaxed: string
    }
    letterSpacing: {
        tight: string
        normal: string
        wide: string
    }
}

export type MotionTokens = {
    duration: {
        instant: string
        fast: string
        normal: string
        slow: string
        slower: string
    }
    easing: {
        linear: string
        easeIn: string
        easeOut: string
        easeInOut: string
        spring: string
    }
}

export type BlurTokens = {
    none: string
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
}

export type BorderWidthTokens = {
    none: string
    thin: string
    default: string
    thick: string
    heavy: string
}

export type BaseTokens = {
    radius: RadiusTokens
    shadow: ShadowTokens
    spacing: SpacingTokens
    typography: TypographyTokens
    motion: MotionTokens
    blur: BlurTokens
    borderWidth: BorderWidthTokens
}
