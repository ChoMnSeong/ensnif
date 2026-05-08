import { useState } from 'react'
import { Label, NumberInput, Stack } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const NumberInputPage = () => {
    const [n, setN] = useState(3)
    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="NumberInput"
                description="−/+ 버튼이 붙은 숫자 입력. min/max/step 클램핑."
            />

            <ComponentPreview
                title="기본"
                code={`<NumberInput value={n} onChange={setN} min={0} max={10} />`}
            >
                <Stack gap={6}>
                    <Label>수량</Label>
                    <NumberInput value={n} onChange={setN} min={0} max={10} />
                </Stack>
            </ComponentPreview>

            <ComponentPreview
                title="Sizes"
                code={`<NumberInput defaultValue={1} size="sm" />
<NumberInput defaultValue={1} size="md" />
<NumberInput defaultValue={1} size="lg" />`}
            >
                <NumberInput defaultValue={1} size="sm" />
                <NumberInput defaultValue={1} size="md" />
                <NumberInput defaultValue={1} size="lg" />
            </ComponentPreview>

            <ComponentPreview
                title="Step / disabled"
                code={`<NumberInput defaultValue={50} step={5} />
<NumberInput defaultValue={5} disabled />`}
            >
                <NumberInput defaultValue={50} step={5} />
                <NumberInput defaultValue={5} disabled />
            </ComponentPreview>
        </>
    )
}
