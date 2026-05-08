import { useState } from 'react'
import { Radio, RadioGroup } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const RadioPage = () => {
    const [plan, setPlan] = useState('basic')

    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Radio"
                description="RadioGroup으로 묶어서 사용. value/onChange 또는 비제어 모드."
            />

            <ComponentPreview
                title="기본"
                code={`<RadioGroup value={plan} onChange={setPlan}>
    <Radio value="basic" label="Basic" />
    <Radio value="pro" label="Pro" />
    <Radio value="enterprise" label="Enterprise" />
</RadioGroup>`}
            >
                <RadioGroup
                    name="plan"
                    value={plan}
                    onChange={setPlan}
                >
                    <Radio value="basic" label="Basic — 무료" />
                    <Radio value="pro" label="Pro — 월 9,900원" />
                    <Radio
                        value="enterprise"
                        label="Enterprise — 문의"
                    />
                </RadioGroup>
            </ComponentPreview>

            <ComponentPreview
                title="Horizontal"
                description="direction='row'"
                code={`<RadioGroup direction="row" defaultValue="md">
    <Radio value="sm" label="Small" />
    <Radio value="md" label="Medium" />
    <Radio value="lg" label="Large" />
</RadioGroup>`}
            >
                <RadioGroup
                    name="size"
                    direction="row"
                    defaultValue="md"
                >
                    <Radio value="sm" label="Small" />
                    <Radio value="md" label="Medium" />
                    <Radio value="lg" label="Large" />
                </RadioGroup>
            </ComponentPreview>

            <ComponentPreview
                title="Disabled"
                code={`<RadioGroup defaultValue="a" disabled>
    <Radio value="a" label="Option A" />
    <Radio value="b" label="Option B" />
</RadioGroup>`}
            >
                <RadioGroup name="d" defaultValue="a" disabled>
                    <Radio value="a" label="Option A" />
                    <Radio value="b" label="Option B" />
                </RadioGroup>
            </ComponentPreview>
        </>
    )
}
