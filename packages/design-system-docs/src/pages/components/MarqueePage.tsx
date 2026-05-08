import { Avatar, Card, HStack, Marquee } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const bannerStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--ds-color-background-card)',
    border: '1px solid var(--ds-color-border-subtle)',
    borderRadius: 'var(--ds-radius-md)',
    padding: '14px 0',
}

const message = (
    <span
        style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--ds-color-foreground-secondary)',
        }}
    >
        🎉 새 시즌 공개 · 구독자 50% 할인 · 신규 회원 1개월 무료 · ⭐
    </span>
)

const tag = (text: string) => (
    <span
        key={text}
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'var(--ds-color-background-inset)',
            border: '1px solid var(--ds-color-border-subtle)',
            borderRadius: 'var(--ds-radius-full)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--ds-color-foreground-secondary)',
            whiteSpace: 'nowrap',
        }}
    >
        {text}
    </span>
)

export const MarqueePage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Marquee"
            description="끝없이 스크롤되는 텍스트/요소. content가 짧아도 viewport를 가득 채우도록 자동 복제. 5가지 옵션."
        />

        <ComponentPreview
            title="기본 (좌→우 무한)"
            code={`<Marquee>
    <span>🎉 새 시즌 공개 · ...</span>
</Marquee>`}
        >
            <Marquee style={bannerStyle}>{message}</Marquee>
        </ComponentPreview>

        <ComponentPreview
            title="속도 — 빠르게 (speed=4)"
            description="speed는 한 사이클을 도는 데 걸리는 초. 작을수록 빠름."
            code={`<Marquee speed={4}>...</Marquee>`}
        >
            <Marquee speed={4} style={bannerStyle}>
                {message}
            </Marquee>
        </ComponentPreview>

        <ComponentPreview
            title="속도 — 천천히 (speed=30)"
            code={`<Marquee speed={30}>...</Marquee>`}
        >
            <Marquee speed={30} style={bannerStyle}>
                {message}
            </Marquee>
        </ComponentPreview>

        <ComponentPreview
            title="방향 — 오른쪽 (direction='right')"
            code={`<Marquee direction="right">...</Marquee>`}
        >
            <Marquee direction="right" style={bannerStyle}>
                {message}
            </Marquee>
        </ComponentPreview>

        <ComponentPreview
            title="hover 시 정지 끄기 (pauseOnHover={false})"
            code={`<Marquee pauseOnHover={false}>...</Marquee>`}
        >
            <Marquee pauseOnHover={false} style={bannerStyle}>
                {message}
            </Marquee>
        </ComponentPreview>

        <ComponentPreview
            title="아이템 간 간격 (gap={40})"
            description="children 안의 자식 요소 사이 간격."
            code={`<Marquee gap={40}>
    {tags.map(t => <Tag>{t}</Tag>)}
</Marquee>`}
        >
            <Marquee gap={40} style={bannerStyle}>
                {[
                    '#액션',
                    '#로맨스',
                    '#판타지',
                    '#SF',
                    '#일상',
                    '#스포츠',
                    '#호러',
                ].map(tag)}
            </Marquee>
        </ComponentPreview>

        <ComponentPreview
            title="카드 캐러셀"
            description="복잡한 내용도 가능. 자동으로 viewport 채울 만큼 복제됨."
            code={`<Marquee gap={16} speed={20}>
    {avatars.map(a => <ProfileCard {...a} />)}
</Marquee>`}
        >
            <Marquee
                gap={16}
                speed={20}
                style={{ width: '100%' }}
            >
                {[1, 2, 3, 4, 5].map((i) => (
                    <Card
                        key={i}
                        style={{
                            width: '180px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            textAlign: 'center',
                        }}
                    >
                        <Avatar
                            size="md"
                            src={`https://i.pravatar.cc/100?img=${i + 10}`}
                            name={`User ${i}`}
                        />
                        <div
                            style={{
                                fontSize: '12px',
                                fontWeight: 600,
                            }}
                        >
                            User {i}
                        </div>
                        <div
                            style={{
                                fontSize: '11px',
                                color: 'var(--ds-color-foreground-tertiary)',
                            }}
                        >
                            Premium
                        </div>
                    </Card>
                ))}
            </Marquee>
        </ComponentPreview>

        <ComponentPreview
            title="짧은 content 자동 복제"
            description="content가 viewport보다 짧으면 자동으로 사본을 늘려 빈 공간 없이 흐름."
            code={`<Marquee>
    <span>짧은 텍스트</span>
</Marquee>`}
        >
            <Marquee style={bannerStyle}>
                <HStack gap={16}>
                    <span style={{ fontSize: '14px' }}>⭐ 짧은 메시지</span>
                </HStack>
            </Marquee>
        </ComponentPreview>
    </>
)
