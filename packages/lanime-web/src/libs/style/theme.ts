type ThemeVariables = {
    // ==========================
    // 페이지 배경
    // ==========================
    bg_page1: string // 메인 페이지 배경
    bg_page2: string // 서브 페이지 / 섹션 배경

    // ==========================
    // UI 요소 배경
    // ==========================
    bg_element1: string // 카드, 박스, 컨테이너 배경
    bg_element2: string // 버튼, 태그 배경
    bg_element3: string // 강조 요소 / hover 영역 배경
    bg_element4: string // 입력 필드, 폼 배경
    bg_element5: string // 모달 / 팝업 배경
    bg_element6: string // 툴팁 / 라벨 / 배지 배경

    // ==========================
    // 텍스트
    // ==========================
    text1: string // 메인 텍스트 / 중요한 제목, 본문
    text2: string // 부제목 / 중요하지만 서브 텍스트
    text3: string // 설명 / 세부 텍스트 / 서브 정보
    text4: string // 보조 텍스트 / 힌트 / 상태 / 날짜

    // ==========================
    // 테두리
    // ==========================
    border1: string // 주요 테두리 (카드, 박스 등)
    border2: string // 부가 테두리 (입력 필드, 버튼 등)

    // ==========================
    // 포인트 / 버튼 / 상태
    // ==========================
    primary1: string // 메인 포인트 색상 (버튼, 강조 요소)
    primary2: string // 보조 포인트 / 밝은 보라 (#d2a9ff)
    success1: string // 성공 상태 기본 색상 (파란색)
    success_hover: string // 성공 상태 hover 색상
    success_disabled: string // 성공 상태 disabled 색상
    destructive1: string // 실패 상태 기본 색상 (빨강)
    destructive_hover: string // 실패 상태 hover 색상
    destructive_disabled: string // 실패 상태 disabled 색상
    disabled: string // 일반 비활성화 색상
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
        text4: '#6E6E6E',

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
        bg_page2: '#2C2C2C',
        bg_element1: '#1E1E1E',
        bg_element2: '#252525',
        bg_element3: '#2E2E2E',
        bg_element4: '#2C2C2C',
        bg_element5: '#252525',
        bg_element6: '#0c0c0c',

        text1: '#FAFAF8',
        text2: '#ECEAE4',
        text3: '#ACACAC',
        text4: '#595959',

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

// ==========================
// CSS 변수 생성 함수
// ==========================
const buildCssVariables = (variables: ThemeVariables) => {
    const keys = Object.keys(variables) as (keyof ThemeVariables)[]
    return keys.reduce(
        (acc, key) =>
            acc.concat(`--${key.replace(/_/g, '-')}: ${variables[key]};\n`, ''),
        '',
    )
}

// ==========================
// Emotion / CSS용 테마
// ==========================
export const themes = {
    light: buildCssVariables(themeVariableSets.light),
    dark: buildCssVariables(themeVariableSets.dark),
}

// ==========================
// CSS var() 형태 팔레트
// ==========================
const cssVar = (name: string) => `var(--${name.replace(/_/g, '-')})`

const variableKeys = Object.keys(themeVariableSets.light) as VariableKey[]

export const themedPalette: Record<VariableKey, string> = variableKeys.reduce(
    (acc, current) => {
        acc[current] = cssVar(current)
        return acc
    },
    {} as ThemedPalette,
)
