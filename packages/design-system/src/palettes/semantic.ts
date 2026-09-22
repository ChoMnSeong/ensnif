import type { ColorScale } from './types.js'

/**
 * 의미색도 presets 와 같은 OKLCH 공식으로 생성한다.
 * 예전에는 green/red/blue 프리셋과 값이 완전히 중복이었는데,
 * 팔레트를 바꿀 때 한쪽만 갱신되면 톤이 어긋나므로 각자 생성한다.
 */

export const successScale: ColorScale = {
        50: '#ebf8ed',
        100: '#d1f1d6',
        200: '#a0e4ae',
        300: '#67d483',
        400: '#39c065',
        500: '#37a659',
        600: '#2e8348',
        700: '#266939',
        800: '#1d502b',
        900: '#153a1f',
}

export const warningScale: ColorScale = {
        50: '#fef2e5',
        100: '#fde2c5',
        200: '#fbc689',
        300: '#f7a635',
        400: '#d89232',
        500: '#bb7f30',
        600: '#946529',
        700: '#765121',
        800: '#5a3d19',
        900: '#412c12',
}

export const dangerScale: ColorScale = {
        50: '#fef1ef',
        100: '#fddfdb',
        200: '#fbc1b9',
        300: '#f99d92',
        400: '#f5776b',
        500: '#f14a43',
        600: '#c4332f',
        700: '#9d2a26',
        800: '#78201c',
        900: '#571814',
}

export const infoScale: ColorScale = {
        50: '#eef5fe',
        100: '#d8e9fd',
        200: '#b3d4fa',
        300: '#89bef8',
        400: '#5fa7f4',
        500: '#3390ed',
        600: '#2b72bb',
        700: '#235b95',
        800: '#1a4572',
        900: '#133253',
}
