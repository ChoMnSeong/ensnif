import { Label, Stack, Textarea } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const TextareaPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Textarea"
            description="여러 줄 입력. Input과 같은 4개 variant + autoResize 옵션."
        />

        <ComponentPreview
            title="Variants"
            code={`<Textarea variant="outlined" placeholder="Outlined" />
<Textarea variant="filled" placeholder="Filled" />
<Textarea variant="ghost" placeholder="Ghost" />
<Textarea variant="underline" placeholder="Underline" />`}
        >
            <Stack gap={12} style={{ width: '100%', maxWidth: '420px' }}>
                <Textarea variant="outlined" placeholder="Outlined" fullWidth />
                <Textarea variant="filled" placeholder="Filled" fullWidth />
                <Textarea variant="ghost" placeholder="Ghost" fullWidth />
                <Textarea
                    variant="underline"
                    placeholder="Underline"
                    fullWidth
                />
            </Stack>
        </ComponentPreview>

        <ComponentPreview
            title="Auto resize"
            code={`<Textarea autoResize rows={2} placeholder="작성해주세요..." />`}
        >
            <Stack gap={6} style={{ width: '100%', maxWidth: '420px' }}>
                <Label>코멘트</Label>
                <Textarea
                    autoResize
                    rows={2}
                    placeholder="작성해주세요..."
                    fullWidth
                />
            </Stack>
        </ComponentPreview>
    </>
)
