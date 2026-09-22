# @ensnif/design-system

`lanime` 생태계용 디자인 시스템. 토큰 + 테마 + Provider + React 컴포넌트를 한 패키지에 제공합니다.
시각 스타일(Variant), 팔레트(Palette), 모드(Mode)를 서로 독립적으로 조합할 수 있도록 설계되어 있습니다.

## 핵심 개념

세 축이 모두 **독립적으로 조합** 됩니다.

```
[Palette]   ×   [Variant]            ×   [Mode]
lavender         minimal                  light
blue             neumorphism              dark
green            glassmorphism
red              brutalism
mono             retro
orange
pink
teal
yellow
indigo
```

- **Palette (10)**: `lavender`, `blue`, `green`, `red`, `mono`, `orange`, `pink`, `teal`, `yellow`, `indigo`
- **Variant (5)**: `minimal`, `neumorphism`, `glassmorphism`, `brutalism`, `retro`
- **Mode (2)**: `light`, `dark`

| Variant | 어울리는 상황 |
| --- | --- |
| `minimal` | SaaS, 관리/설정 페이지, 컨텐츠 중심. 모든 케이스의 안전한 기본값 |
| `neumorphism` | 컨트롤 패널, 위젯, 부드러운 입체감 강조 |
| `glassmorphism` | 비디오 오버레이, 랜딩 hero, macOS·iOS 풍 |
| `brutalism` | 패션, 아트, 포트폴리오, 브랜드 캠페인. 강한 정체성 |
| `retro` | Y2K, 이벤트·캠페인 페이지, 힙한 브랜딩 |

> 더 둥근 느낌이 필요하면 `minimal` + `tokenOverrides={{ radius: { md: '16px', lg: '20px' } }}`로 즉시 적용 가능합니다.

조합은 모두 CSS 변수로 풀어져 `<DesignSystemProvider>` 가 적용된 범위에 자동 주입됩니다.

## 설치

```bash
pnpm add @ensnif/design-system
```

## 빠른 시작

```tsx
import { DesignSystemProvider, themeTokens } from '@ensnif/design-system'

function App() {
  return (
    <DesignSystemProvider palette="lavender" variant="minimal" mode="light">
      <YourApp />
    </DesignSystemProvider>
  )
}

const styles = {
  card: {
    background: themeTokens.surface.card.background,
    border: themeTokens.surface.card.border,
    borderRadius: themeTokens.surface.card.radius,
    boxShadow: themeTokens.surface.card.shadow,
    color: themeTokens.surface.card.color,
    padding: themeTokens.spacing[6],
  },
  button: {
    background: themeTokens.color.accent.background,
    color: themeTokens.color.accent.color,
    borderRadius: themeTokens.radius.md,
    padding: `${themeTokens.spacing[2]} ${themeTokens.spacing[4]}`,
    transition: `all ${themeTokens.motion.duration.normal} ${themeTokens.motion.easing.easeOut}`,
  },
}
```

## 테마 전환

```tsx
import { useDesignSystem } from '@ensnif/design-system'

function ThemeSwitcher() {
  const { theme, setPalette, setVariant, toggleMode } = useDesignSystem()
  return (
    <>
      <button onClick={() => setPalette('blue')}>Blue</button>
      <button onClick={() => setVariant('glassmorphism')}>Glass</button>
      <button onClick={toggleMode}>{theme.mode}</button>
    </>
  )
}
```

## 커스텀 팔레트

기본 10개에 없는 색을 쓰려면 객체로 직접 주입할 수 있습니다.

```tsx
<DesignSystemProvider
  palette={{
    name: 'brand',
    label: 'Brand',
    primary: {
      50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc',
      400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1',
      800: '#075985', 900: '#0c4a6e',
    },
  }}
  variant="rounded"
  mode="light"
/>
```

기본 팔레트의 일부 step만 덮어쓰려면 `paletteOverrides` 사용.

```tsx
<DesignSystemProvider
  palette="lavender"
  paletteOverrides={{ primary: { 500: '#a45cff' } }}
/>
```

## 토큰 오버라이드

특정 token group(radius, shadow 등)만 바꾸고 싶을 때.

```tsx
<DesignSystemProvider
  variant="minimal"
  tokenOverrides={{
    radius: { md: '20px', lg: '28px' },
    typography: { fontFamily: { sans: '"Pretendard", sans-serif' } },
  }}
/>
```

## 적용 범위

- `applyTo="root"` (기본): `document.documentElement`에 CSS 변수 적용. 앱 전체 테마 변경.
- `applyTo="scope"`: 자식만 감싸는 `<div>`에 적용. 페이지 일부에 다른 테마 미리보기 등.

```tsx
<DesignSystemProvider applyTo="scope" variant="brutalism">
  <PreviewArea />
</DesignSystemProvider>
```

## SSR (FOUC 방지)

서버 렌더링 시 첫 페인트에 CSS 변수가 없으면 깜빡임이 생깁니다. 두 가지 방법으로 해결할 수 있습니다.

### 1. HTML 문자열에 직접 주입 (Express/Vite SSR 등)

```ts
import { injectThemeIntoHtml } from '@ensnif/design-system'

app.get('*', (req, res) => {
  const theme = { palette: 'lavender', variant: 'minimal', mode: 'light' }
  let html = template
  html = injectThemeIntoHtml(html, theme)
  res.send(html)
})
```

`injectThemeIntoHtml`은:
- `<head>` 안에 `<style data-ds-init="true">:root { --ds-... }</style>` 삽입
- `<html>` 태그에 `data-ds-palette="..." data-ds-variant="..." data-ds-mode="..."` 부착

클라이언트에서 `<DesignSystemProvider>` 가 마운트되면 SSR style 태그를 자동 제거하고 inline style로 인계받습니다 (값이 동일하므로 깜빡임 없음).

### 2. React 트리 안에서 컴포넌트로

`<head>` 직접 제어가 어려운 환경(ex. Helmet 미사용)에서:

```tsx
import { DesignSystemStyle, DesignSystemProvider } from '@ensnif/design-system'

const theme = { palette: 'lavender', variant: 'minimal', mode: 'light' } as const

function Document() {
  return (
    <html>
      <head>
        <DesignSystemStyle {...theme} />
      </head>
      <body>
        <DesignSystemProvider {...theme}>
          <App />
        </DesignSystemProvider>
      </body>
    </html>
  )
}
```

### 3. 저수준 helper

```ts
import { renderThemeStyle, renderThemeCss, renderHtmlAttrs } from '@ensnif/design-system'

const { css, styleTag, dataAttrs, vars } = renderThemeStyle(theme, { nonce: cspNonce })
const cssOnly = renderThemeCss(theme)
const htmlAttrs = renderHtmlAttrs(theme)  // 'data-ds-palette="..." data-ds-variant="..." ...'
```

CSP `nonce` 옵션, 커스텀 `selector` (예: `:root.ds-scope`), `indent` 모두 지원.

## 빌드된 토큰 직접 사용

Provider 없이 정적 CSS를 생성하려면:

```tsx
import { buildTheme, themeToCssVars, cssVarsToString } from '@ensnif/design-system'

const theme = buildTheme({ palette: 'mono', variant: 'card', mode: 'dark' })
const vars = themeToCssVars(theme)
const cssText = cssVarsToString(vars)
```

## API 요약

| 항목 | 설명 |
| --- | --- |
| `DesignSystemProvider` | 전역/scope 테마 적용 |
| `useDesignSystem()` | `{ theme, setPalette, setVariant, setMode, toggleMode }` |
| `useTheme()` | 현재 `ResolvedTheme` 반환 |
| `themeTokens` | CSS 변수 참조 토큰. 컴포넌트 스타일에서 직접 사용 |
| `buildTheme(input)` | 팔레트×variant×mode → ResolvedTheme |
| `themeToCssVars(theme)` | ResolvedTheme → `{ '--ds-...': '값' }` |
| `palettes`, `paletteNames` | 모든 프리셋 |
| `variants`, `variantNames` | 모든 variant 정의 |

## CSS 변수 네임스페이스

모든 변수는 `--ds-` 접두사 사용. camelCase 경로는 kebab-case 로 변환된다
(`typography.fontFamily.mono` → `--ds-typography-font-family-mono`).

- `--ds-palette-primary-50 ~ 900`, `--ds-palette-neutral-50 ~ 900`
- `--ds-color-background-{page,panel,card,overlay,inset,muted,scrim}`
- `--ds-color-foreground-{primary,secondary,tertiary,muted,on-accent}`
- `--ds-color-foreground-on-{primary,success,warning,danger,info}`
  해당 색을 배경으로 깔았을 때 그 위에 얹을 글자색. 흰색과 중립 900 중
  대비가 높은 쪽이 자동 선택되어 라이트/다크 양쪽에서 WCAG AA 를 맞춘다.
- `--ds-color-accent-{background,color,border,shadow,hover-background,active-background}`
- `--ds-color-state-{success,warning,danger,info,disabled}`
- `--ds-color-shadow-{ambient,key,strong,glow}`
  팔레트 중립색에서 파생된 그림자 색. `--ds-shadow-*` 가 이 값을 참조하므로
  그림자가 순수 검정 대신 테마 색조를 따라간다. `glow` 만 primary 기반.
- `--ds-color-focus-ring`
- `--ds-surface-{page,panel,card,overlay,inset}-{background,border,radius,shadow,color,backdrop-filter}`
- `--ds-z-index-{base,raised,dropdown,sticky,overlay,modal,popover,toast,tooltip}`
- `--ds-radius-*`, `--ds-shadow-*`, `--ds-spacing-*`, `--ds-typography-*`,
  `--ds-motion-*`, `--ds-blur-*`, `--ds-border-width-*`

## 인터랙션 레이어

컴포넌트는 인라인 `style` 기반이라 `:hover` / `:active` 를 스스로 표현하지 못한다.
`DesignSystemProvider` 가 주입하는 `InteractionStyles` 가 데이터 어트리뷰트로 이를 대신한다.

| 어트리뷰트 | 쓰는 곳 | hover / active |
|---|---|---|
| `data-ds-interactive="accent"` | 주 액션 버튼 | accent hover/active 토큰 + 눌림 |
| `data-ds-interactive="outline"` | 테두리 트리거 | muted 배경 + 테두리 강조 |
| `data-ds-interactive="subtle"` | 메뉴/탭/트리/페이지네이션 | muted 배경. 선택된 항목은 배경 유지 |
| `data-ds-interactive="success\|warning\|danger"` | 의미색 버튼 | `color-mix` 로 명도 이동 |
| `data-ds-interactive="surface"` | 카드/드롭존 | 그림자 상승 |
| `data-ds-interactive="control"` | Checkbox/Radio/Switch | 자식 `[data-ds-focus-visual]` 로 전달 |
| `data-ds-numeric` | 표/지표/차트 | `tabular-nums` 로 숫자 자릿수 고정 |
| `data-ds-spinner` | 로딩 표시 | reduced-motion 에서도 유지(속도만 완화) |
| `data-ds-disabled` | label 등 `:disabled` 가 없는 요소 | 인터랙션 제외 |

선언에 `!important` 가 붙어 있다. 인라인 `style` 이 캐스케이드에서 일반 규칙을 이기기 때문이며,
이 때문에 소비처에서 `style` 로 hover 색을 덮어쓸 수는 없다.

`prefers-reduced-motion` 과 `prefers-reduced-transparency` 대응도 이 레이어에 들어 있다.

## 폰트

`TypographyStyles` 가 DS 루트(`[data-ds-mode]`)에 `--ds-typography-font-family-sans` 를 세운다.
컴포넌트 대부분이 `font-family: inherit` 이므로 이 값이 상속 사슬의 출발점이 된다.
`DesignSystemProvider` 의 `fonts` prop 이나 `tokenOverrides.typography.fontFamily` 로 바꾸면
전체에 반영된다.

**웹폰트는 이 패키지가 받지 않는다.** 라이브러리가 임의로 네트워크 요청을 만들지 않기 위해서다.
토큰이 기본값으로 지정한 `Inter` / `Pretendard` / `JetBrains Mono` / `Source Serif 4` 를
쓰려면 앱에서 로드해야 한다. 받지 않아도 폴백 체인이 있어 시스템 폰트로 정상 동작한다.

```html
<!-- 앱의 index.html -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500;700&family=Source+Serif+4:wght@400;600;700&display=swap" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css" />
```

앱에서 `html`/`body`/`#root` 에 `font-family` 를 직접 지정하면 `#root` 쪽 명시도가 더 높아
DS 규칙을 덮어쓰고 `fonts` prop 이 먹지 않는다. 지정하지 말 것.
후자는 glassmorphism variant 의 `backdrop-filter` 를 끄고 표면을 불투명으로 내린다.

## 구조

```
src/
├── tokens/        radius, shadow, zIndex, spacing, typography, motion, blur, borderWidth
├── palettes/      10개 컬러 프리셋 + neutral + semantic(success/warning/danger/info)
├── variants/      5개 시각 스타일 (각 mode/palette 컨텍스트로 surface, accent 빌드)
├── themes/        buildTheme, themeToCssVars, themeTokens (CSS 변수 참조)
├── provider/      DesignSystemProvider, FocusStyles, InteractionStyles,
│                  TypographyStyles, useDesignSystem
├── components/    Button, Input, Card, Dialog, Drawer, Tabs, Table, DataTable,
│                  LineChart, BarChart, AreaChart, PieChart, RadarChart,
│                  RadialChart, DatePicker, ComboBox, ColorPicker, Toast 등 50+
└── utils/         cssVar, deepMerge, flattenTokens
```

## 컴포넌트 사용 예

```tsx
import {
  DesignSystemProvider,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
} from '@ensnif/design-system'

function App() {
  return (
    <DesignSystemProvider palette="lavender" variant="minimal" mode="light">
      <Card>
        <CardHeader>
          <CardTitle>안녕하세요</CardTitle>
        </CardHeader>
        <CardBody>
          <Button variant="primary">시작</Button>
        </CardBody>
      </Card>
    </DesignSystemProvider>
  )
}
```
