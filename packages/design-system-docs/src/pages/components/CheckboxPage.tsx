import { useState } from 'react'
import { Checkbox } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const CheckboxPage = () => {
    const [a, setA] = useState(true)
    const [b, setB] = useState(false)

    const items = [
        { id: 1, label: '액션', checked: true },
        { id: 2, label: '로맨스', checked: false },
        { id: 3, label: '판타지', checked: true },
    ]
    const allChecked = items.every((i) => i.checked)
    const someChecked = items.some((i) => i.checked)

    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Checkbox"
                description="단일 선택 체크박스. controlled / uncontrolled, indeterminate, disabled 지원."
            />

            <ComponentPreview
                title="기본"
                code={`<Checkbox label="이용약관 동의" checked={a} onChange={(e) => setA(e.target.checked)} />`}
            >
                <Checkbox
                    label="이용약관 동의"
                    checked={a}
                    onChange={(e) => setA(e.target.checked)}
                />
                <Checkbox
                    label="개인정보 수집"
                    checked={b}
                    onChange={(e) => setB(e.target.checked)}
                />
                <Checkbox label="비활성" disabled />
                <Checkbox label="비활성 + 체크" disabled defaultChecked />
            </ComponentPreview>

            <ComponentPreview
                title="Indeterminate"
                description="자식 일부만 체크된 그룹 헤더용"
                code={`<Checkbox
    label="모두"
    checked={allChecked}
    indeterminate={!allChecked && someChecked}
/>`}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                    }}
                >
                    <Checkbox
                        label="모두"
                        checked={allChecked}
                        indeterminate={!allChecked && someChecked}
                    />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            paddingLeft: '20px',
                        }}
                    >
                        {items.map((i) => (
                            <Checkbox
                                key={i.id}
                                label={i.label}
                                defaultChecked={i.checked}
                            />
                        ))}
                    </div>
                </div>
            </ComponentPreview>

            <ComponentPreview
                title="Sizes"
                code={`<Checkbox size="sm" label="Small" />
<Checkbox size="md" label="Medium" />`}
            >
                <Checkbox size="sm" label="Small" defaultChecked />
                <Checkbox size="md" label="Medium" defaultChecked />
            </ComponentPreview>
        </>
    )
}
