import type { CSSProperties, HTMLAttributes, Ref } from 'react'
import { mergeStyles } from './types.js'

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
        <div
            ref={ref}
            data-ds-scrollbar=""
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
    )
}
