export type ColorScale = {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
}

export type ColorScaleStep = keyof ColorScale

export type PaletteName =
    | 'lavender'
    | 'blue'
    | 'green'
    | 'red'
    | 'mono'
    | 'orange'
    | 'pink'
    | 'teal'
    | 'yellow'
    | 'indigo'

export type Palette = {
    name: PaletteName
    label: string
    primary: ColorScale
    neutral: ColorScale
}

export type CustomPalette = {
    name: string
    label?: string
    primary: ColorScale
    neutral?: ColorScale
}
