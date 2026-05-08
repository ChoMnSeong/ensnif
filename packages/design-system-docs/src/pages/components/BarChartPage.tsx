import { BarChart, Card } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const GENRES = [
    { label: '액션', value: 42 },
    { label: '로맨스', value: 28 },
    { label: '판타지', value: 35 },
    { label: 'SF', value: 18 },
    { label: '일상', value: 22 },
    { label: '스포츠', value: 14 },
]

const wrap = (children: React.ReactNode) => (
    <Card style={{ width: '100%', maxWidth: '640px' }}>{children}</Card>
)

export const BarChartPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="BarChart"
            description="SVG 기반 막대 차트. rounded top, 그라데이션, hover 강조 기본. 8개 옵션."
        />

        <ComponentPreview
            title="기본 (rounded + gradient)"
            code={`<BarChart data={data} formatValue={(n) => n + '%'} />`}
        >
            {wrap(
                <BarChart data={GENRES} formatValue={(n) => `${n}%`} />,
            )}
        </ComponentPreview>

        <ComponentPreview
            title="값에 따라 진하기 자동 (colorByValue)"
            description="primary 200~700 톤이 값 크기에 따라 자동 매핑"
            code={`<BarChart data={data} colorByValue />`}
        >
            {wrap(
                <BarChart
                    data={GENRES}
                    colorByValue
                    formatValue={(n) => `${n}%`}
                />,
            )}
        </ComponentPreview>

        <ComponentPreview
            title="막대 위 값 표시 (showValueOnBar)"
            code={`<BarChart data={data} showValueOnBar />`}
        >
            {wrap(
                <BarChart
                    data={GENRES}
                    showValueOnBar
                    formatValue={(n) => `${n}%`}
                />,
            )}
        </ComponentPreview>

        <ComponentPreview
            title="가로 막대 (horizontal)"
            code={`<BarChart data={data} horizontal showValueOnBar />`}
        >
            {wrap(
                <BarChart
                    data={GENRES}
                    horizontal
                    showValueOnBar
                    formatValue={(n) => `${n}%`}
                />,
            )}
        </ComponentPreview>

        <ComponentPreview
            title="기준선 (referenceLine)"
            description="평균값 등 참조선 표시"
            code={`<BarChart
    data={data}
    referenceLine={{ value: 28, label: '평균' }}
/>`}
        >
            {wrap(
                <BarChart
                    data={GENRES}
                    referenceLine={{ value: 28, label: '평균' }}
                    formatValue={(n) => `${n}%`}
                />,
            )}
        </ComponentPreview>

        <ComponentPreview
            title="평평한 모서리 (rounded={false})"
            code={`<BarChart data={data} rounded={false} />`}
        >
            {wrap(<BarChart data={GENRES} rounded={false} />)}
        </ComponentPreview>

        <ComponentPreview
            title="간격 / 최소 높이 (barGap, minBarHeight)"
            description="0인 값에도 시각적 단서를 남기고 싶을 때"
            code={`<BarChart data={data} barGap={20} minBarHeight={4} />`}
        >
            {wrap(
                <BarChart
                    data={[
                        ...GENRES,
                        { label: '뉴', value: 0 },
                    ]}
                    barGap={20}
                    minBarHeight={4}
                    showValueOnBar
                    formatValue={(n) => `${n}%`}
                />,
            )}
        </ComponentPreview>

        <ComponentPreview
            title="미니 sparkline (그리드/라벨 제거)"
            code={`<BarChart
    data={data}
    showGrid={false}
    showLabels={false}
    height={60}
    barGap={4}
/>`}
        >
            {wrap(
                <BarChart
                    data={GENRES}
                    showGrid={false}
                    showLabels={false}
                    height={60}
                    barGap={4}
                />,
            )}
        </ComponentPreview>
    </>
)
