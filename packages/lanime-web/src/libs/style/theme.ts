type ThemeVariables = {
    bg_page1: string
    bg_page2: string

    bg_element1: string
    bg_element2: string
    bg_element3: string
    bg_element4: string
    bg_element5: string
    bg_element6: string

    text1: string
    text2: string
    text3: string
    text4: string

    border1: string
    border2: string

    primary1: string
    primary2: string
    success1: string
    success_hover: string
    success_disabled: string
    destructive1: string
    destructive_hover: string
    destructive_disabled: string
    disabled: string
    button_text: string
    white: string
    black: string
    gray1: string
    gray2: string
    gray3: string
    gray4: string
    gray5: string
}

type Theme = 'light' | 'dark'
type VariableKey = keyof ThemeVariables
type ThemedPalette = Record<VariableKey, string>

const themeVariableSets: Record<Theme, ThemeVariables> = {
    light: {
        bg_page1: '#fafaf9',
        bg_page2: '#f5f5f4',
        bg_element1: '#FFFFFF',
        bg_element2: '#FDFBF6',
        bg_element3: '#e7e5e4',
        bg_element4: '#f5f5f4',
        bg_element5: '#FFFFFF',
        bg_element6: '#FBFDFC',

        text1: '#1A1A1A',
        text2: '#222222',
        text3: '#3B3B3B',
        text4: '#595959',

        border1: '#2C2C2C',
        border2: '#ADB5BD',

        primary1: '#b473f9',
        primary2: '#d2a9ff',

        success1: '#3399FF',
        success_hover: '#66B2FF',
        success_disabled: '#A0CFFF',

        destructive1: '#FF6B6B',
        destructive_hover: '#FF8787',
        destructive_disabled: '#FFB3B3',

        disabled: '#CED4DA',

        button_text: '#1A1A1A',

        black: '#1A1A1A',
        white: '#FAFAF8',

        gray1: '#F5F5F5',
        gray2: '#E0E0E0',
        gray3: '#BDBDBD',
        gray4: '#8C8C8C',
        gray5: '#595959',
    },
    dark: {
        bg_page1: '#1A1A1A',
        bg_page2: '#222222',
        bg_element1: '#1E1E1E',
        bg_element2: '#252525',
        bg_element3: '#2E2E2E',
        bg_element4: '#222222',
        bg_element5: '#252525',
        bg_element6: '#0c0c0c',

        text1: '#FAFAF8',
        text2: '#ECEAE4',
        text3: '#ACACAC',
        text4: '#848484',

        border1: '#2C2C2C',
        border2: '#4D4D4D',

        primary1: '#b473f9',
        primary2: '#d2a9ff',

        success1: '#3399FF',
        success_hover: '#66B2FF',
        success_disabled: '#A0CFFF',

        destructive1: '#FF6B6B',
        destructive_hover: '#FF8787',
        destructive_disabled: '#FFB3B3',

        disabled: '#595959',

        button_text: '#FAFAF8',
        black: '#1A1A1A',
        white: '#FAFAF8',

        gray1: '#F5F5F5',
        gray2: '#E0E0E0',
        gray3: '#BDBDBD',
        gray4: '#8C8C8C',
        gray5: '#595959',
    },
}

const buildCssVariables = (variables: ThemeVariables) => {
    const keys = Object.keys(variables) as (keyof ThemeVariables)[]
    return keys.reduce(
        (acc, key) =>
            acc.concat(`--${key.replace(/_/g, '-')}: ${variables[key]};\n`, ''),
        '',
    )
}

export const themes = {
    light: buildCssVariables(themeVariableSets.light),
    dark: buildCssVariables(themeVariableSets.dark),
}

const cssVar = (name: string) => `var(--${name.replace(/_/g, '-')})`

const variableKeys = Object.keys(themeVariableSets.light) as VariableKey[]

export const themedPalette: Record<VariableKey, string> = variableKeys.reduce(
    (acc, current) => {
        acc[current] = cssVar(current)
        return acc
    },
    {} as ThemedPalette,
)
