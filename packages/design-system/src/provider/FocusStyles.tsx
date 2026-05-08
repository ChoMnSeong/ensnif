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
`.trim()

export const FocusStyles = () => (
    <style data-ds-focus-styles dangerouslySetInnerHTML={{ __html: FOCUS_CSS }} />
)
