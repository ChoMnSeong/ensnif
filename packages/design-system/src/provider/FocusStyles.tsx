const FOCUS_CSS = `
[data-ds-focusable]:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--ds-color-focus-ring);
}
[data-ds-focus-input]:focus-visible + [data-ds-focus-visual] {
    box-shadow: 0 0 0 3px var(--ds-color-focus-ring);
}
[data-ds-focus-within]:focus-within {
    box-shadow:
        0 0 0 1px var(--ds-palette-primary-500),
        0 0 0 4px var(--ds-color-focus-ring);
    border-color: var(--ds-palette-primary-500);
}
[data-ds-focus-within][data-ds-input-variant="underline"]:focus-within {
    box-shadow: none;
    border-bottom: 2px solid var(--ds-palette-primary-500);
}
[data-ds-focus-within][data-ds-input-variant="ghost"]:focus-within {
    border-color: transparent;
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
