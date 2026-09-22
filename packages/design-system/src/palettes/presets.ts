import type { Palette } from './types.js'

/**
 * primary 스케일은 OKLCH 에서 생성한다. 밝기 램프는 고정이고 채도는
 * 각 색상의 sRGB 색역 여유에 비례하되 절대 상한을 함께 건다.
 * 색역 경계에 붙으면 채널이 포화되어 형광처럼 튀고, 여유만 따르면
 * 초록·틸처럼 여유가 넓은 색상의 옅은 단계가 과하게 진해진다.
 * lavender 와 mono 는 손으로 맞춘 값이라 생성 대상에서 제외한다.
 */
import {
    slateNeutral,
    zincNeutral,
    mauveNeutral,
    sageNeutral,
    oliveNeutral,
    sandNeutral,
} from './neutral.js'

export const lavender: Palette = {
    name: 'lavender',
    label: 'Lavender',
    primary: {
        50: '#f6f0ff',
        100: '#ecdcff',
        200: '#d9b9ff',
        300: '#c596ff',
        400: '#b473f9',
        500: '#a35def',
        600: '#8a45d4',
        700: '#7035ad',
        800: '#562984',
        900: '#3c1c5c',
    },
    neutral: mauveNeutral,
}

export const blue: Palette = {
    name: 'blue',
    label: 'Blue',
    primary: {
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
    },
    neutral: slateNeutral,
}

export const green: Palette = {
    name: 'green',
    label: 'Green',
    primary: {
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
    },
    neutral: sageNeutral,
}

export const red: Palette = {
    name: 'red',
    label: 'Red',
    primary: {
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
    },
    neutral: sandNeutral,
}

export const mono: Palette = {
    name: 'mono',
    label: 'Mono',
    primary: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#a1a1aa',
        400: '#52525b',
        500: '#27272a',
        600: '#1f1f22',
        700: '#18181b',
        800: '#0f0f11',
        // 순수 검정 대신 off-black. #000000 은 화면에서 구멍처럼 읽힌다.
        900: '#09090b',
    },
    neutral: zincNeutral,
}

export const orange: Palette = {
    name: 'orange',
    label: 'Orange',
    primary: {
        50: '#fef2e9',
        100: '#fde1ce',
        200: '#fbc49c',
        300: '#f9a25d',
        400: '#e78832',
        500: '#c87730',
        600: '#9e5f28',
        700: '#7e4b21',
        800: '#603919',
        900: '#462912',
    },
    neutral: oliveNeutral,
}

export const pink: Palette = {
    name: 'pink',
    label: 'Pink',
    primary: {
        50: '#fef0f4',
        100: '#fddee8',
        200: '#fbbdd2',
        300: '#f996bc',
        400: '#f66ca6',
        500: '#e94392',
        600: '#bc3173',
        700: '#96285c',
        800: '#731f46',
        900: '#531732',
    },
    neutral: mauveNeutral,
}

export const teal: Palette = {
    name: 'teal',
    label: 'Teal',
    primary: {
        50: '#e5f9f8',
        100: '#c1f2f1',
        200: '#77e6e6',
        300: '#3cd1d1',
        400: '#39b7b7',
        500: '#379f9f',
        600: '#2e7e7e',
        700: '#266564',
        800: '#1d4d4c',
        900: '#153737',
    },
    neutral: sageNeutral,
}

export const yellow: Palette = {
    name: 'yellow',
    label: 'Yellow',
    primary: {
        50: '#f9f4e5',
        100: '#f3e7c2',
        200: '#e9cf81',
        300: '#dbb535',
        400: '#c0a032',
        500: '#a68b30',
        600: '#836e29',
        700: '#695821',
        800: '#504319',
        900: '#393012',
    },
    neutral: oliveNeutral,
}

export const indigo: Palette = {
    name: 'indigo',
    label: 'Indigo',
    primary: {
        50: '#f2f3fe',
        100: '#e2e6fd',
        200: '#c7cefb',
        300: '#aab3f8',
        400: '#9099f4',
        500: '#7880ef',
        600: '#5a57e6',
        700: '#4844bb',
        800: '#36348f',
        900: '#262667',
    },
    neutral: slateNeutral,
}
