import {
    Button,
    IconArrowDown,
    IconArrowRight,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const ButtonPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Button"
            description="primary / secondary / ghost / success / warning / danger 6종 + 3 size + 로딩/아이콘 슬롯."
        />

        <ComponentPreview
            title="Variants"
            code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button disabled>Disabled</Button>`}
        >
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
        </ComponentPreview>

        <ComponentPreview
            title="Sizes"
            description="sm / md / lg"
            code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
        >
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
        </ComponentPreview>

        <ComponentPreview
            title="Semantic"
            code={`<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="danger">Danger</Button>`}
        >
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="danger">Danger</Button>
        </ComponentPreview>

        <ComponentPreview
            title="Loading + icon"
            code={`<Button iconLeft={<IconArrowDown />}>Download</Button>
<Button iconRight={<IconArrowRight />} variant="secondary">Continue</Button>`}
        >
            <Button loading>Saving</Button>
            <Button iconLeft={<IconArrowDown size={14} />}>Download</Button>
            <Button
                iconRight={<IconArrowRight size={14} />}
                variant="secondary"
            >
                Continue
            </Button>
        </ComponentPreview>
    </>
)
