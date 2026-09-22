/**
 * 타이포그래피 레이어.
 *
 * 컴포넌트 35곳이 `fontFamily: 'inherit'` 로 선언되어 있는데, 정작 그 'inherit' 의
 * 출발점을 아무도 세워주지 않았다. 그래서 --ds-typography-font-family-sans 토큰과
 * DesignSystemProvider 의 `fonts` prop 이 값만 바뀔 뿐 화면에는 반영되지 않았다.
 *
 * 여기서 DS 루트([data-ds-mode] = applyTo 'root' 면 html, 'scope' 면 스코프 div)에
 * sans 를 세워 그 상속 사슬의 출발점을 만든다.
 *
 * 웹폰트 로딩은 하지 않는다. 라이브러리가 임의로 네트워크 요청을 발생시키면 안 되고,
 * 어떤 폰트를 어떤 방식(self-host / CDN)으로 받을지는 앱이 정할 문제다.
 * 토큰의 폴백 체인이 있으므로 폰트를 안 받아도 시스템 폰트로 정상 동작한다.
 */

const TYPOGRAPHY_CSS = `
[data-ds-mode] {
    font-family: var(--ds-typography-font-family-sans);
    /* 줄 끝에 단어 하나만 남는 것을 막는다. 미지원 브라우저는 무시하고 넘어간다. */
    text-wrap: pretty;
}
`.trim()

export const TypographyStyles = () => (
    <style
        data-ds-typography-styles
        dangerouslySetInnerHTML={{ __html: TYPOGRAPHY_CSS }}
    />
)
