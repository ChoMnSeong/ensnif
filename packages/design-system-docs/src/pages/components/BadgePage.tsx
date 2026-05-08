import { Badge } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const BadgePage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Badge"
            description="작은 라벨/태그. tone(default/accent/success/warning/danger/info), solid 채움, dot 옵션."
        />

        <ComponentPreview
            title="Tones"
            code={`<Badge>NEW</Badge>
<Badge tone="accent">PRO</Badge>
<Badge tone="success" solid>ACTIVE</Badge>`}
        >
            <Badge>DEFAULT</Badge>
            <Badge tone="accent">ACCENT</Badge>
            <Badge tone="success">SUCCESS</Badge>
            <Badge tone="warning">WARNING</Badge>
            <Badge tone="danger">DANGER</Badge>
            <Badge tone="info">INFO</Badge>
        </ComponentPreview>

        <ComponentPreview
            title="Solid"
            code={`<Badge tone="accent" solid>ACCENT</Badge>
<Badge tone="success" solid>SUCCESS</Badge>`}
        >
            <Badge tone="accent" solid>
                ACCENT
            </Badge>
            <Badge tone="success" solid>
                SUCCESS
            </Badge>
            <Badge tone="warning" solid>
                WARNING
            </Badge>
            <Badge tone="danger" solid>
                DANGER
            </Badge>
        </ComponentPreview>

        <ComponentPreview
            title="With dot"
            code={`<Badge dot tone="success">Online</Badge>
<Badge dot tone="warning">Idle</Badge>`}
        >
            <Badge dot tone="success">
                Online
            </Badge>
            <Badge dot tone="warning">
                Idle
            </Badge>
            <Badge dot tone="danger">
                Offline
            </Badge>
        </ComponentPreview>

        <ComponentPreview
            title="Sizes"
            code={`<Badge size="sm" tone="accent">SM</Badge>
<Badge size="md" tone="accent">MD</Badge>`}
        >
            <Badge size="sm" tone="accent">
                SM
            </Badge>
            <Badge size="md" tone="accent">
                MD
            </Badge>
        </ComponentPreview>
    </>
)
