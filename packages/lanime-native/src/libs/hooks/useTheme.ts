import { useColorScheme } from 'react-native'
import { palettes, ThemeMode, ThemePalette } from '@libs/style/theme'

export const useTheme = (): { mode: ThemeMode; palette: ThemePalette } => {
    const scheme = useColorScheme()
    const mode: ThemeMode = scheme === 'light' ? 'light' : 'dark'
    return { mode, palette: palettes[mode] }
}
