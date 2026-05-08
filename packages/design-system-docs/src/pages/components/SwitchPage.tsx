import { useState } from 'react'
import { Switch } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const SwitchPage = () => {
    const [on, setOn] = useState(true)
    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Switch"
                description="iOS 스타일 토글. on/off 명확한 상태가 필요한 설정 항목에 사용."
            />

            <ComponentPreview
                title="기본"
                code={`<Switch checked={on} onChange={(e) => setOn(e.target.checked)} label="다크 모드" />`}
            >
                <Switch
                    label="다크 모드"
                    checked={on}
                    onChange={(e) => setOn(e.target.checked)}
                />
                <Switch label="알림 받기" defaultChecked />
                <Switch label="자동 재생" />
                <Switch label="비활성" disabled />
                <Switch label="비활성 + on" disabled defaultChecked />
            </ComponentPreview>

            <ComponentPreview
                title="Sizes"
                code={`<Switch size="sm" label="Small" />
<Switch size="md" label="Medium" />`}
            >
                <Switch size="sm" label="Small" defaultChecked />
                <Switch size="md" label="Medium" defaultChecked />
            </ComponentPreview>
        </>
    )
}
