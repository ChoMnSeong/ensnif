import { Tag, HStack, Stack } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const TagPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Tag"
            description="Badge보다 넓게, 닫기 가능. tone, solid 옵션, onClose."
        />

        <ComponentPreview
            title="Tones"
            code={`<Tag tone="accent">액션</Tag>
<Tag tone="success" solid>완료</Tag>`}
        >
            <Stack gap={10}>
                <HStack gap={6} wrap>
                    <Tag>기본</Tag>
                    <Tag tone="accent">액션</Tag>
                    <Tag tone="success">완료</Tag>
                    <Tag tone="warning">대기</Tag>
                    <Tag tone="danger">실패</Tag>
                    <Tag tone="info">새 기능</Tag>
                </HStack>
                <HStack gap={6} wrap>
                    <Tag tone="accent" solid>
                        액션
                    </Tag>
                    <Tag tone="success" solid>
                        완료
                    </Tag>
                    <Tag tone="warning" solid>
                        대기
                    </Tag>
                    <Tag tone="danger" solid>
                        실패
                    </Tag>
                </HStack>
            </Stack>
        </ComponentPreview>

        <ComponentPreview
            title="Closable"
            code={`<Tag onClose={() => {}}>액션</Tag>
<Tag tone="accent" onClose={() => {}}>로맨스</Tag>
<Tag tone="info" solid onClose={() => {}}>판타지</Tag>`}
        >
            <HStack gap={6} wrap>
                <Tag onClose={() => alert('removed')}>액션</Tag>
                <Tag tone="accent" onClose={() => {}}>
                    로맨스
                </Tag>
                <Tag tone="info" solid onClose={() => {}}>
                    판타지
                </Tag>
            </HStack>
        </ComponentPreview>
    </>
)
