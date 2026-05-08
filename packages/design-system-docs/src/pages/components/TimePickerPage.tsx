import { useState } from 'react'
import { Label, Stack, TimePicker } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const TimePickerPage = () => {
    const [t, setT] = useState('09:30')
    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="TimePicker"
                description="HH:mm 입력. minuteStep, use24Hours 옵션."
            />

            <ComponentPreview
                title="기본"
                code={`<TimePicker value={t} onChange={setT} minuteStep={5} />`}
            >
                <Stack gap={6}>
                    <Label>시작 시간</Label>
                    <TimePicker value={t} onChange={setT} />
                    <span
                        style={{
                            fontSize: '11px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            fontFamily: '"JetBrains Mono", monospace',
                        }}
                    >
                        {t}
                    </span>
                </Stack>
            </ComponentPreview>

            <ComponentPreview
                title="12시간제 + 30분 단위"
                code={`<TimePicker defaultValue="14:30" minuteStep={30} use24Hours={false} />`}
            >
                <TimePicker
                    defaultValue="14:30"
                    minuteStep={30}
                    use24Hours={false}
                />
            </ComponentPreview>
        </>
    )
}
