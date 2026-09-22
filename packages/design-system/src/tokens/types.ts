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

export type ZIndexTokens = {
    base: string
    raised: string
    dropdown: string
    sticky: string
    overlay: string
    modal: string
    popover: string
    toast: string
    tooltip: string
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

export type TypographyRole =
    | 'display-lg'
    | 'display-md'
    | 'display-sm'
    | 'headline'
    | 'title'
    | 'body-lg'
    | 'body'
    | 'body-sm'
    | 'caption'
    | 'label'
    | 'button'
    | 'mono'

export type TypographyRoleSpec = {
    fontSize: string
    fontWeight: string
    lineHeight: string
    letterSpacing: string
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
        tighter: string
        tight: string
        normal: string
        wide: string
    }
    /**
     * 크기·굵기·행간·자간을 묶은 의미 역할.
     * 크기 스케일만 노출하면 쓰는 쪽에서 매번 조합이 달라진다.
     */
    role: Record<TypographyRole, TypographyRoleSpec>
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
    zIndex: ZIndexTokens
    spacing: SpacingTokens
    typography: TypographyTokens
    motion: MotionTokens
    blur: BlurTokens
    borderWidth: BorderWidthTokens
}
