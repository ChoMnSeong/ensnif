import { renderThemeCss } from '../themes/ssr.js'
import type { BuildThemeInput } from '../themes/types.js'

export type DesignSystemStyleProps = BuildThemeInput & {
    selector?: string
    nonce?: string
}

export const DesignSystemStyle = ({
    selector,
    nonce,
    ...input
}: DesignSystemStyleProps) => {
    const css = renderThemeCss(input, { selector, nonce })
    return (
        <style
            data-ds-init="true"
            {...(nonce ? { nonce } : {})}
            dangerouslySetInnerHTML={{ __html: css }}
        />
    )
}
