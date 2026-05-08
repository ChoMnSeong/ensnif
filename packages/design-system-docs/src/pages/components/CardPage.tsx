import {
    Card,
    CardBody,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Button,
    Badge,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const CardPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Card"
            description="Surface 토큰을 사용하는 컨테이너. Header / Title / Description / Body / Footer 슬롯 제공."
        />

        <ComponentPreview
            title="기본"
            code={`<Card>
    <CardHeader>
        <CardTitle>카드 제목</CardTitle>
        <CardDescription>설명 텍스트</CardDescription>
    </CardHeader>
    <CardBody>본문 컨텐츠.</CardBody>
</Card>`}
        >
            <Card style={{ width: '320px' }}>
                <CardHeader>
                    <CardTitle>이번 주 시청</CardTitle>
                    <CardDescription>5월 1일 ~ 7일 누적</CardDescription>
                </CardHeader>
                <CardBody>
                    <div
                        style={{
                            fontSize: '32px',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            color: 'var(--ds-color-foreground-primary)',
                        }}
                    >
                        24h 12m
                    </div>
                </CardBody>
                <CardFooter>
                    <Badge tone="success" dot>
                        +18%
                    </Badge>
                    <span
                        style={{
                            fontSize: '12px',
                            color: 'var(--ds-color-foreground-tertiary)',
                        }}
                    >
                        지난 주 대비
                    </span>
                </CardFooter>
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="Surface 변경"
            code={`<Card surface="panel">...</Card>
<Card surface="card">...</Card>
<Card surface="overlay">...</Card>`}
        >
            <Card surface="panel" style={{ width: '260px' }}>
                <CardTitle>panel</CardTitle>
                <CardBody>가장 약한 elevation</CardBody>
            </Card>
            <Card surface="card" style={{ width: '260px' }}>
                <CardTitle>card</CardTitle>
                <CardBody>기본 카드</CardBody>
            </Card>
            <Card surface="overlay" style={{ width: '260px' }}>
                <CardTitle>overlay</CardTitle>
                <CardBody>가장 강한 elevation</CardBody>
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="액션 카드"
            code={`<Card>
    <CardHeader>
        <CardTitle>구독 업그레이드</CardTitle>
        <CardDescription>설명</CardDescription>
    </CardHeader>
    <CardFooter>
        <Button variant="primary" size="sm">업그레이드</Button>
        <Button variant="ghost" size="sm">나중에</Button>
    </CardFooter>
</Card>`}
        >
            <Card style={{ width: '320px' }}>
                <CardHeader>
                    <CardTitle>구독 업그레이드</CardTitle>
                    <CardDescription>
                        Premium 멤버십으로 광고 없이 시청하세요.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button variant="primary" size="sm">
                        업그레이드
                    </Button>
                    <Button variant="ghost" size="sm">
                        나중에
                    </Button>
                </CardFooter>
            </Card>
        </ComponentPreview>
    </>
)
