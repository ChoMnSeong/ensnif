import { useState } from 'react'
import {
    IconBold,
    IconItalic,
    IconUnderline,
    Toggle,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const TogglePage = () => {
    const [bold, setBold] = useState(true)
    const [italic, setItalic] = useState(false)
    const [under, setUnder] = useState(false)

    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Toggle"
                description="버튼 형태의 on/off. Switch와 달리 버튼 그룹(예: 텍스트 서식)에 적합."
            />

            <ComponentPreview
                title="기본"
                code={`<Toggle pressed={bold} onPressedChange={setBold}>
    <IconBold />
</Toggle>`}
            >
                <Toggle
                    pressed={bold}
                    onPressedChange={setBold}
                    aria-label="Bold"
                >
                    <IconBold size={16} />
                </Toggle>
                <Toggle
                    pressed={italic}
                    onPressedChange={setItalic}
                    aria-label="Italic"
                >
                    <IconItalic size={16} />
                </Toggle>
                <Toggle
                    pressed={under}
                    onPressedChange={setUnder}
                    aria-label="Underline"
                >
                    <IconUnderline size={16} />
                </Toggle>
            </ComponentPreview>

            <ComponentPreview
                title="Sizes"
                code={`<Toggle size="sm" defaultPressed>Small</Toggle>
<Toggle size="md" defaultPressed>Medium</Toggle>
<Toggle size="lg" defaultPressed>Large</Toggle>`}
            >
                <Toggle size="sm" defaultPressed>
                    Small
                </Toggle>
                <Toggle size="md" defaultPressed>
                    Medium
                </Toggle>
                <Toggle size="lg" defaultPressed>
                    Large
                </Toggle>
            </ComponentPreview>
        </>
    )
}
