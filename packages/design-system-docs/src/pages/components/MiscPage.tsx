import {
    Divider,
    Empty,
    HStack,
    Kbd,
    Skeleton,
    Spacer,
    Spinner,
    Stack,
    Stat,
    VStack,
    Tag,
    IconArrowDown,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const DividerPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Divider"
            description="섹션 구분선. horizontal/vertical, label 옵션."
        />

        <ComponentPreview
            title="기본"
            code={`<Divider inset />`}
        >
            <div style={{ width: '100%', maxWidth: '480px' }}>
                <p
                    style={{
                        margin: 0,
                        fontSize: '13px',
                        color: 'var(--ds-color-foreground-secondary)',
                    }}
                >
                    위쪽 컨텐츠
                </p>
                <Divider inset />
                <p
                    style={{
                        margin: 0,
                        fontSize: '13px',
                        color: 'var(--ds-color-foreground-secondary)',
                    }}
                >
                    아래쪽 컨텐츠
                </p>
            </div>
        </ComponentPreview>

        <ComponentPreview
            title="With label"
            code={`<Divider label="Or" />`}
        >
            <div style={{ width: '100%', maxWidth: '480px' }}>
                <Divider label="Or" />
            </div>
        </ComponentPreview>

        <ComponentPreview
            title="Vertical"
            code={`<Divider orientation="vertical" style={{ height: '20px' }} />`}
        >
            <HStack gap={16} align="center">
                <span style={{ fontSize: '13px' }}>Left</span>
                <Divider orientation="vertical" style={{ height: '20px' }} />
                <span style={{ fontSize: '13px' }}>Middle</span>
                <Divider orientation="vertical" style={{ height: '20px' }} />
                <span style={{ fontSize: '13px' }}>Right</span>
            </HStack>
        </ComponentPreview>
    </>
)

export const StackPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Stack / Spacer"
            description="VStack(세로) / HStack(가로) 레이아웃 도우미. Spacer로 빈 공간 채움."
        />

        <ComponentPreview
            title="VStack / HStack"
            code={`<HStack gap={12}><Tag>A</Tag><Tag>B</Tag></HStack>`}
        >
            <Stack gap={20} style={{ width: '100%' }}>
                <HStack gap={8}>
                    <Tag>Tag</Tag>
                    <Tag>Another</Tag>
                    <Tag>Item</Tag>
                </HStack>
                <VStack gap={4} align="flex-start">
                    <Tag>Top</Tag>
                    <Tag>Middle</Tag>
                    <Tag>Bottom</Tag>
                </VStack>
            </Stack>
        </ComponentPreview>

        <ComponentPreview
            title="Spacer (auto fill)"
            code={`<HStack>
    <Tag>Left</Tag>
    <Spacer />
    <Tag tone="accent">Right</Tag>
</HStack>`}
        >
            <HStack
                gap={8}
                align="center"
                style={{
                    width: '100%',
                    padding: '10px',
                    background: 'var(--ds-color-background-inset)',
                    borderRadius: 'var(--ds-radius-md)',
                }}
            >
                <Tag>Left</Tag>
                <Spacer />
                <Tag tone="accent">Right</Tag>
            </HStack>
        </ComponentPreview>
    </>
)

export const SpinnerPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Spinner"
            description="로딩 인디케이터. size, thickness, label 지원."
        />

        <ComponentPreview
            title="Sizes"
            code={`<Spinner size={12} />
<Spinner size={16} />
<Spinner size={24} />
<Spinner size={32} />`}
        >
            <Spinner size={12} />
            <Spinner size={16} />
            <Spinner size={24} />
            <Spinner size={32} />
        </ComponentPreview>

        <ComponentPreview
            title="With label"
            code={`<Spinner label="불러오는 중..." />`}
        >
            <Spinner label="불러오는 중..." />
        </ComponentPreview>
    </>
)

export const SkeletonPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Skeleton"
            description="콘텐츠 로딩 플레이스홀더. width/height/circle/lines."
        />

        <ComponentPreview
            title="기본"
            code={`<Skeleton height={20} width="60%" />
<Skeleton lines={3} />`}
        >
            <Stack gap={8} style={{ width: '100%', maxWidth: '320px' }}>
                <Skeleton height={20} width="60%" />
                <Skeleton lines={3} />
            </Stack>
        </ComponentPreview>

        <ComponentPreview
            title="Card placeholder"
            code={`<HStack>
    <Skeleton circle width={40} height={40} />
    <Stack>
        <Skeleton height={12} width="60%" />
        <Skeleton height={10} width="40%" />
    </Stack>
</HStack>
<Skeleton lines={2} height={10} />`}
        >
            <div
                style={{
                    width: '300px',
                    padding: '16px',
                    background: 'var(--ds-color-background-card)',
                    border: '1px solid var(--ds-color-border-subtle)',
                    borderRadius: 'var(--ds-radius-lg)',
                }}
            >
                <HStack gap={12} align="center" style={{ marginBottom: '14px' }}>
                    <Skeleton circle width={40} height={40} />
                    <Stack gap={4} style={{ flex: 1 }}>
                        <Skeleton height={12} width="60%" />
                        <Skeleton height={10} width="40%" />
                    </Stack>
                </HStack>
                <Skeleton lines={2} height={10} />
            </div>
        </ComponentPreview>
    </>
)

export const EmptyPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Empty"
            description="비어있는 상태 표시. icon / title / description / action."
        />

        <ComponentPreview
            title="기본"
            code={`<Empty
    icon={<IconArrowDown size={32} />}
    title="시청 기록 없음"
    description="아직 시청한 작품이 없습니다."
/>`}
        >
            <Empty
                icon={<IconArrowDown size={32} />}
                title="시청 기록 없음"
                description="아직 시청한 작품이 없습니다. 둘러보기에서 새 작품을 찾아보세요."
            />
        </ComponentPreview>
    </>
)

export const StatPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Stat"
            description="KPI 표시 카드. label / value / delta / helper."
        />

        <ComponentPreview
            title="기본"
            code={`<Stat
    label="이번 주 시청"
    value="24h 12m"
    delta={{ value: '+18%', tone: 'success' }}
    helper="지난 주 대비"
/>`}
        >
            <HStack gap={12} wrap style={{ width: '100%' }}>
                <Stat
                    label="이번 주 시청"
                    value="24h 12m"
                    delta={{ value: '+18%', tone: 'success' }}
                    helper="지난 주 대비"
                />
                <Stat
                    label="구독자"
                    value="1,284"
                    delta={{ value: '-3%', tone: 'danger' }}
                    helper="이번 달"
                />
                <Stat
                    label="활성 사용자"
                    value="528"
                    helper="현재 시청 중"
                />
            </HStack>
        </ComponentPreview>
    </>
)

export const KbdPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Kbd"
            description="키보드 단축키 표시."
        />

        <ComponentPreview
            title="기본"
            code={`<Kbd>⌘</Kbd>
<Kbd>K</Kbd>`}
        >
            <HStack gap={6} align="center">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
            </HStack>
            <HStack gap={6} align="center">
                <Kbd>Ctrl</Kbd>
                <span style={{ fontSize: '12px' }}>+</span>
                <Kbd>Shift</Kbd>
                <span style={{ fontSize: '12px' }}>+</span>
                <Kbd>P</Kbd>
            </HStack>
        </ComponentPreview>
    </>
)
