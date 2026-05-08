import type { CSSProperties, HTMLAttributes, Ref } from 'react'
import { mergeStyles } from './types.js'

const STYLE_ID = 'ds-scrollarea-style'
const SCROLL_CSS = `
[data-ds-scrollarea] {
    scrollbar-width: thin;
    scrollbar-color: var(--ds-color-border-default) transparent;
}
[data-ds-scrollarea]::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
[data-ds-scrollarea]::-webkit-scrollbar-track {
    background: transparent;
}
[data-ds-scrollarea]::-webkit-scrollbar-thumb {
    background: var(--ds-color-border-default);
    border-radius: 4px;
}
[data-ds-scrollarea]:hover::-webkit-scrollbar-thumb {
    background: var(--ds-color-border-strong);
}
`.trim()

export type ScrollAreaProps = {
    maxHeight?: number | string
    direction?: 'vertical' | 'horizontal' | 'both'
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

export const ScrollArea = ({
    maxHeight,
    direction = 'vertical',
    style,
    ref,
    children,
    ...rest
}: ScrollAreaProps) => {
    const overflow: CSSProperties =
        direction === 'horizontal'
            ? { overflowX: 'auto', overflowY: 'hidden' }
            : direction === 'both'
              ? { overflow: 'auto' }
              : { overflowY: 'auto', overflowX: 'hidden' }

    return (
        <>
            <style id={STYLE_ID}>{SCROLL_CSS}</style>
            <div
                ref={ref}
                data-ds-scrollarea=""
                style={mergeStyles(
                    {
                        maxHeight:
                            typeof maxHeight === 'number'
                                ? `${maxHeight}px`
                                : maxHeight,
                        ...overflow,
                    },
                    style,
                )}
                {...rest}
            >
                {children}
            </div>
        </>
    )
}
