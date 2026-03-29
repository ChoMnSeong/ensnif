import { css } from '@emotion/react'
import { themes } from '@libs/style/theme'
const GlobalStyles = css`
    body {
        -webkit-touch-callout: none;
        -moz-user-select: none;
        -ms-user-select: none;
        /* 추가 폰트 폴백: 한글 및 확장 시스템 폰트 */
        font-family:
            Roboto, 'Segoe UI', Oxygen, Ubuntu, Cantarell,
            'Apple SD Gothic Neo', 'Malgun Gothic', '맑은 고딕', 나눔고딕,
            'Nanum Gothic', 'Noto Sans KR', 'Noto Sans CJK KR', Dotum, sans-serif;
    }

    * {
        font-family: inherit;
    }

    code {
        font-family:
            'Fira Mono', source-code-pro, Menlo, Monaco, Consolas,
            'Courier New', monospace;
    }

    body {
        ${themes.light}
        background-color: var(--bg-page1);
    }

    @media (prefers-color-scheme: dark) {
        body {
            ${themes.dark}
            background-color: var(--bg-page1);
        }
    }

    body[data-theme='light'] {
        ${themes.light};
        background-color: var(--bg-page1);
    }

    body[data-theme='dark'] {
        ${themes.dark};
        background-color: var(--bg-page1);
    }
`

export default GlobalStyles
