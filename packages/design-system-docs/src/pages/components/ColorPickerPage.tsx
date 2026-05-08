import { useState } from 'react'
import { ColorPicker, Label, Stack } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const ColorPickerPage = () => {
    const [color, setColor] = useState('#a35def')
    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="ColorPicker"
                description="HEX 입력 + native color input + 12 swatch 그리드. 팝오버는 Portal로."
            />

            <ComponentPreview
                title="기본"
                code={`<ColorPicker value={color} onChange={setColor} />`}
            >
                <Stack gap={6}>
                    <Label>브랜드 색상</Label>
                    <ColorPicker value={color} onChange={setColor} />
                    <span
                        style={{
                            fontSize: '11px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            fontFamily: '"JetBrains Mono", monospace',
                        }}
                    >
                        선택: {color}
                    </span>
                </Stack>
            </ComponentPreview>

            <ComponentPreview
                title="커스텀 swatches"
                code={`<ColorPicker
    defaultValue="#3b82f6"
    swatches={['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e']}
/>`}
            >
                <ColorPicker
                    defaultValue="#3b82f6"
                    swatches={[
                        '#0ea5e9',
                        '#3b82f6',
                        '#6366f1',
                        '#8b5cf6',
                        '#ec4899',
                        '#f43f5e',
                    ]}
                />
            </ComponentPreview>
        </>
    )
}
