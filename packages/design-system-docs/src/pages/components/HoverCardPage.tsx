import { Avatar, Button, HoverCard, HStack, Stack } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const HoverCardPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="HoverCard"
            description="hover 시 카드 형태의 추가 정보 표시. Tooltip보다 풍부한 컨텐츠."
        />

        <ComponentPreview
            title="기본"
            code={`<HoverCard content={<UserCard />}>
    <Button>프로필 보기</Button>
</HoverCard>`}
        >
            <HoverCard
                content={
                    <Stack gap={10}>
                        <HStack gap={10} align="center">
                            <Avatar name="Lanime User" size="md" />
                            <Stack gap={2}>
                                <span
                                    style={{
                                        fontSize: '13px',
                                        fontWeight: 700,
                                    }}
                                >
                                    Lanime User
                                </span>
                                <span
                                    style={{
                                        fontSize: '11px',
                                        color: 'var(--ds-color-foreground-tertiary)',
                                    }}
                                >
                                    @lanime
                                </span>
                            </Stack>
                        </HStack>
                        <p
                            style={{
                                margin: 0,
                                fontSize: '12px',
                                color: 'var(--ds-color-foreground-secondary)',
                                lineHeight: 1.5,
                            }}
                        >
                            구독 멤버 · 2024년 가입 · 시청 시간 1,284시간
                        </p>
                    </Stack>
                }
            >
                <Button variant="secondary">프로필에 hover</Button>
            </HoverCard>
        </ComponentPreview>
    </>
)
