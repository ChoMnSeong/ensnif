import { useState } from 'react'
import { Label, Slider, Stack } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const SliderPage = () => {
    const [v, setV] = useState(60)
    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Slider"
                description="범위 입력. min/max/step, 라벨 표시, 포맷 함수."
            />

            <ComponentPreview
                title="기본"
                code={`<Slider value={v} onChange={setV} min={0} max={100} showLabel />`}
            >
                <Stack gap={6} style={{ width: '100%', maxWidth: '420px' }}>
                    <Label>볼륨</Label>
                    <Slider
                        value={v}
                        onChange={setV}
                        showLabel
                        formatValue={(n) => `${n}%`}
                    />
                </Stack>
            </ComponentPreview>

            <ComponentPreview
                title="Step / range"
                code={`<Slider defaultValue={5} min={0} max={10} step={1} showLabel />`}
            >
                <Stack gap={6} style={{ width: '100%', maxWidth: '420px' }}>
                    <Slider
                        defaultValue={5}
                        min={0}
                        max={10}
                        step={1}
                        showLabel
                    />
                </Stack>
            </ComponentPreview>

            <ComponentPreview
                title="Disabled"
                code={`<Slider defaultValue={40} disabled />`}
            >
                <Slider defaultValue={40} disabled style={{ maxWidth: '420px' }} />
            </ComponentPreview>
        </>
    )
}
