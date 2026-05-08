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
| `minimal` | SaaS, 관리/설정 페이지, 컨텐츠 중심 — 모든 케이스의 안전한 기본값 |
| `neumorphism` | 컨트롤 패널, 위젯, 부드러운 입체감 강조 |
| `glassmorphism` | 비디오 오버레이, 랜딩 hero, macOS·iOS 풍 |
| `brutalism` | 패션, 아트, 포트폴리오, 브랜드 캠페인 — 강한 정체성 |
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

모든 변수는 `--ds-` 접두사 사용. 주요 그룹:

- `--ds-palette-primary-50 ~ 900`, `--ds-palette-neutral-50 ~ 900`
- `--ds-color-background-{page,panel,card,overlay,inset,muted}`
- `--ds-color-foreground-{primary,secondary,tertiary,muted,onAccent}`
- `--ds-color-accent-{background,color,border,shadow,hoverBackground,activeBackground}`
- `--ds-color-state-{success,warning,danger,info,disabled}`
- `--ds-surface-{page,panel,card,overlay,inset}-{background,border,radius,shadow,color,backdrop-filter}`
- `--ds-radius-*`, `--ds-shadow-*`, `--ds-spacing-*`, `--ds-typography-*`, `--ds-motion-*`, `--ds-blur-*`, `--ds-borderWidth-*`

## 구조

```
src/
├── tokens/        radius, shadow, spacing, typography, motion, blur, borderWidth
├── palettes/      10개 컬러 프리셋 + neutral + semantic(success/warning/danger/info)
├── variants/      5개 시각 스타일 (각 mode/palette 컨텍스트로 surface, accent 빌드)
├── themes/        buildTheme, themeToCssVars, themeTokens (CSS 변수 참조)
├── provider/      DesignSystemProvider, useDesignSystem
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
