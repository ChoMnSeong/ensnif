import { Button, HStack, Tooltip } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const TooltipPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Tooltip"
            description="hover/focus 시 표시되는 짧은 설명. side(top/bottom), align."
        />

        <ComponentPreview
            title="기본"
            code={`<Tooltip content="저장하기">
    <Button>저장</Button>
</Tooltip>`}
        >
            <HStack gap={8}>
                <Tooltip content="저장하기">
                    <Button>저장</Button>
                </Tooltip>
                <Tooltip content="취소" side="top">
                    <Button variant="secondary">취소</Button>
                </Tooltip>
                <Tooltip content="아래쪽에 표시" side="bottom">
                    <Button variant="ghost">아래</Button>
                </Tooltip>
            </HStack>
        </ComponentPreview>
    </>
)
