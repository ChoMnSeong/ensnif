/*
 * !important 가 붙은 이유: 컴포넌트가 box-shadow 를 인라인 style 로 지정한다.
 * borderVariantContainerStyle 은 모든 variant 에서 boxShadow: 'none' 을 돌려주고
 * Button/Checkbox/Switch/Slider 도 인라인으로 그림자를 건다. 인라인 선언은
 * 캐스케이드에서 일반 스타일시트 규칙을 이기므로, 이게 없으면 선택자가 매칭돼도
 * 포커스 링이 그려지지 않는다. InteractionStyles 와 같은 이유다.
 */
const FOCUS_CSS = `
[data-ds-focusable]:focus-visible {
    outline: none !important;
    box-shadow: 0 0 0 3px var(--ds-color-focus-ring) !important;
}
[data-ds-focus-input]:focus-visible + [data-ds-focus-visual] {
    box-shadow: 0 0 0 3px var(--ds-color-focus-ring) !important;
}
/* 포커스를 받는 요소가 시각적 행보다 넓을 때(트리 항목은 자식 그룹까지 감싼다)
   링을 행 쪽으로 옮긴다. */
[data-ds-focus-row]:focus-visible {
    outline: none !important;
}
[data-ds-focus-row]:focus-visible > [data-ds-focus-visual] {
    box-shadow: 0 0 0 3px var(--ds-color-focus-ring) !important;
}
[data-ds-focus-within]:focus-within {
    box-shadow:
        0 0 0 1px var(--ds-palette-primary-500),
        0 0 0 4px var(--ds-color-focus-ring) !important;
    border-color: var(--ds-palette-primary-500) !important;
}
[data-ds-focus-within][data-ds-input-variant="underline"]:focus-within {
    box-shadow: none !important;
    border-bottom: 2px solid var(--ds-palette-primary-500) !important;
}
[data-ds-focus-within][data-ds-input-variant="ghost"]:focus-within {
    border-color: transparent !important;
}
[data-ds-numberinput] input[type=number]::-webkit-outer-spin-button,
[data-ds-numberinput] input[type=number]::-webkit-inner-spin-button,
input[type=number][data-ds-numberinput]::-webkit-outer-spin-button,
input[type=number][data-ds-numberinput]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
[data-ds-numberinput] input[type=number],
input[type=number][data-ds-numberinput] {
    -moz-appearance: textfield;
    appearance: textfield;
}
[data-ds-scrollbar],
html[data-ds-mode],
html[data-ds-mode] body {
    scrollbar-width: thin;
    scrollbar-color: var(--ds-color-border-default) transparent;
}
[data-ds-scrollbar]::-webkit-scrollbar,
html[data-ds-mode]::-webkit-scrollbar,
html[data-ds-mode] body::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
[data-ds-scrollbar]::-webkit-scrollbar-track,
html[data-ds-mode]::-webkit-scrollbar-track,
html[data-ds-mode] body::-webkit-scrollbar-track {
    background: transparent;
}
[data-ds-scrollbar]::-webkit-scrollbar-thumb,
html[data-ds-mode]::-webkit-scrollbar-thumb,
html[data-ds-mode] body::-webkit-scrollbar-thumb {
    background: var(--ds-color-border-default);
    border-radius: 6px;
    border: 2px solid transparent;
    background-clip: padding-box;
    transition: background 160ms ease;
}
[data-ds-scrollbar]:hover::-webkit-scrollbar-thumb,
html[data-ds-mode]:hover::-webkit-scrollbar-thumb,
html[data-ds-mode] body:hover::-webkit-scrollbar-thumb {
    background: var(--ds-color-border-strong);
    background-clip: padding-box;
}
[data-ds-scrollbar]::-webkit-scrollbar-corner,
html[data-ds-mode]::-webkit-scrollbar-corner,
html[data-ds-mode] body::-webkit-scrollbar-corner {
    background: transparent;
}
`.trim()

export const FocusStyles = () => (
    <style data-ds-focus-styles dangerouslySetInnerHTML={{ __html: FOCUS_CSS }} />
)
