import { useEffect, useState } from 'react'
import { Progress, Stack } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const ProgressPage = () => {
    const [v, setV] = useState(0)
    useEffect(() => {
        const t = setInterval(() => setV((p) => (p >= 100 ? 0 : p + 5)), 400)
        return () => clearInterval(t)
    }, [])

    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Progress"
                description="선형 진행 표시. value/max, size, tone, indeterminate."
            />

            <ComponentPreview
                title="기본"
                code={`<Progress value={60} showLabel />`}
            >
                <Stack gap={16} style={{ width: '100%', maxWidth: '480px' }}>
                    <Progress value={v} showLabel />
                    <Progress value={32} tone="success" />
                    <Progress value={78} tone="warning" />
                    <Progress value={12} tone="danger" />
                </Stack>
            </ComponentPreview>

            <ComponentPreview
                title="Sizes"
                code={`<Progress value={50} size="sm" />
<Progress value={50} size="md" />
<Progress value={50} size="lg" />`}
            >
                <Stack gap={12} style={{ width: '100%', maxWidth: '480px' }}>
                    <Progress value={50} size="sm" />
                    <Progress value={50} size="md" />
                    <Progress value={50} size="lg" />
                </Stack>
            </ComponentPreview>

            <ComponentPreview
                title="Indeterminate"
                code={`<Progress value={0} indeterminate />`}
            >
                <Progress value={0} indeterminate style={{ maxWidth: '480px' }} />
            </ComponentPreview>
        </>
    )
}
