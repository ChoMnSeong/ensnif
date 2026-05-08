import { Card, LineChart } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const WEEK = [
    { label: 'Mon', value: 18 },
    { label: 'Tue', value: 32 },
    { label: 'Wed', value: 24 },
    { label: 'Thu', value: 41 },
    { label: 'Fri', value: 56 },
    { label: 'Sat', value: 78 },
    { label: 'Sun', value: 67 },
]

const LAST_WEEK = [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 24 },
    { label: 'Wed', value: 18 },
    { label: 'Thu', value: 30 },
    { label: 'Fri', value: 42 },
    { label: 'Sat', value: 60 },
    { label: 'Sun', value: 50 },
]

const wrap = (children: React.ReactNode) => (
    <Card style={{ width: '100%', maxWidth: '640px' }}>{children}</Card>
)

export const LineChartPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="LineChart"
            description="SVG 기반 라인 차트. smooth 곡선, 영역 채움, hover 툴팁 기본 제공. 9개 옵션."
        />

        <ComponentPreview
            title="기본 (filled + smooth)"
            code={`<LineChart data={data} formatValue={(n) => n + 'h'} />`}
        >
            {wrap(
                <LineChart data={WEEK} formatValue={(n) => `${n}h`} />,
            )}
        </ComponentPreview>

        <ComponentPreview
            title="라인만 (fill={false})"
            description="배경 채움 없이 깔끔한 라인만"
            code={`<LineChart data={data} fill={false} />`}
        >
            {wrap(<LineChart data={WEEK} fill={false} />)}
        </ComponentPreview>

        <ComponentPreview
            title="각진 라인 (smooth={false})"
            description="실제 데이터 포인트를 직선으로 연결"
            code={`<LineChart data={data} smooth={false} />`}
        >
            {wrap(<LineChart data={WEEK} smooth={false} />)}
        </ComponentPreview>

        <ComponentPreview
            title="점 위에 값 표시 (showValueOnDot)"
            code={`<LineChart data={data} showValueOnDot />`}
        >
            {wrap(
                <LineChart
                    data={WEEK}
                    showValueOnDot
                    formatValue={(n) => `${n}h`}
                />,
            )}
        </ComponentPreview>

        <ComponentPreview
            title="점 숨김 (showDots={false})"
            code={`<LineChart data={data} showDots={false} />`}
        >
            {wrap(<LineChart data={WEEK} showDots={false} />)}
        </ComponentPreview>

        <ComponentPreview
            title="Dashed 라인"
            code={`<LineChart data={data} dashed lineWidth={3} fill={false} />`}
        >
            {wrap(
                <LineChart
                    data={WEEK}
                    dashed
                    lineWidth={3}
                    fill={false}
                />,
            )}
        </ComponentPreview>

        <ComponentPreview
            title="기준선 (referenceLine)"
            description="목표/평균 등 참조선 표시"
            code={`<LineChart
    data={data}
    referenceLine={{ value: 50, label: '목표' }}
/>`}
        >
            {wrap(
                <LineChart
                    data={WEEK}
                    referenceLine={{ value: 50, label: '목표' }}
                />,
            )}
        </ComponentPreview>

        <ComponentPreview
            title="비교 시리즈 (compareData)"
            description="보조 라인을 dashed로 함께 표시 + 툴팁에 두 값 모두"
            code={`<LineChart
    data={thisWeek}
    compareData={lastWeek}
    compareLabel="지난 주"
/>`}
        >
            {wrap(
                <LineChart
                    data={WEEK}
                    compareData={LAST_WEEK}
                    compareLabel="지난 주"
                    formatValue={(n) => `${n}h`}
                />,
            )}
        </ComponentPreview>

        <ComponentPreview
            title="Y축 위치 변경 (yAxisPosition='right')"
            code={`<LineChart data={data} yAxisPosition="right" />`}
        >
            {wrap(<LineChart data={WEEK} yAxisPosition="right" />)}
        </ComponentPreview>

        <ComponentPreview
            title="축/그리드 모두 제거"
            description="미니멀한 sparkline 스타일"
            code={`<LineChart
    data={data}
    showGrid={false}
    yAxisPosition="none"
    showXAxis={false}
    showDots={false}
    height={80}
/>`}
        >
            {wrap(
                <LineChart
                    data={WEEK}
                    showGrid={false}
                    yAxisPosition="none"
                    showXAxis={false}
                    showDots={false}
                    height={80}
                />,
            )}
        </ComponentPreview>
    </>
)
