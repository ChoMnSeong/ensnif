import { useState } from 'react'
import { DatePicker, Label } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const DatePickerPage = () => {
    const [date, setDate] = useState<string | undefined>(undefined)

    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="DatePicker"
                description="단일 날짜 선택. 월 단위 네비게이션, ISO 형식 (YYYY-MM-DD) 출력."
            />

            <ComponentPreview
                title="기본"
                code={`<DatePicker value={date} onChange={setDate} />`}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                    }}
                >
                    <Label>시청 시작일</Label>
                    <DatePicker value={date} onChange={setDate} />
                    <span
                        style={{
                            fontSize: '11px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            fontFamily: '"JetBrains Mono", monospace',
                        }}
                    >
                        선택된 값: {date ?? '(없음)'}
                    </span>
                </div>
            </ComponentPreview>

            <ComponentPreview
                title="기본값 + 월요일 시작"
                code={`<DatePicker defaultValue="2026-05-07" weekStartsOn={1} />`}
            >
                <DatePicker defaultValue="2026-05-07" weekStartsOn={1} />
            </ComponentPreview>

            <ComponentPreview
                title="Disabled"
                code={`<DatePicker defaultValue="2026-01-01" disabled />`}
            >
                <DatePicker defaultValue="2026-01-01" disabled />
            </ComponentPreview>
        </>
    )
}
