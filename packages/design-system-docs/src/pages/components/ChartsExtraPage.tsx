import {
    AreaChart,
    Card,
    HStack,
    RadarChart,
    RadialChart,
    Stack,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const AreaChartPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="AreaChart"
            description="다중 시리즈 + 영역 채움. hover 시 모든 시리즈 값을 한 줄에 표시."
        />
        <ComponentPreview
            title="다중 시리즈"
            code={`<AreaChart
    labels={WEEK}
    formatValue={(n) => \`\${n}h\`}
    series={[
        { label: '이번 주', values: [12, 18, 14, 22, 28, 36, 32] },
        { label: '지난 주', values: [8, 14, 12, 18, 22, 28, 24] },
    ]}
/>`}
        >
            <Card style={{ width: '100%', maxWidth: '640px' }}>
                <h4
                    style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        margin: '0 0 14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--ds-color-foreground-tertiary)',
                    }}
                >
                    이번 주 시청 비교
                </h4>
                <AreaChart
                    labels={WEEK}
                    formatValue={(n) => `${n}h`}
                    series={[
                        {
                            label: '이번 주',
                            values: [12, 18, 14, 22, 28, 36, 32],
                        },
                        {
                            label: '지난 주',
                            values: [8, 14, 12, 18, 22, 28, 24],
                        },
                    ]}
                />
            </Card>
        </ComponentPreview>
    </>
)

const RADAR_AXES = ['속도', '강도', '기술', '체력', '회복', '집중']
const RADAR_A = { label: 'A 캐릭터', values: [82, 65, 90, 72, 60, 88] }
const RADAR_B = { label: 'B 캐릭터', values: [60, 88, 72, 95, 78, 65] }

export const RadarChartPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="RadarChart"
            description="다축 비교 (스파이더 차트). primary 단색 톤 기본. fill / showDots / gridShape / gridFilled / axisLabelRender 옵션."
        />

        <ComponentPreview title="기본 (filled + dots)" code={`<RadarChart axes={...} series={[...]} />`}>
            <Card>
                <RadarChart axes={RADAR_AXES} max={100} series={[RADAR_A]} />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="라인만 (fill={false})"
            description="채움 없이 윤곽선만"
            code={`<RadarChart axes={...} series={[...]} fill={false} />`}
        >
            <Card>
                <RadarChart
                    axes={RADAR_AXES}
                    max={100}
                    series={[RADAR_A]}
                    fill={false}
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="점 없이 (showDots={false})"
            code={`<RadarChart axes={...} series={[...]} showDots={false} />`}
        >
            <Card>
                <RadarChart
                    axes={RADAR_AXES}
                    max={100}
                    series={[RADAR_A]}
                    showDots={false}
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="그리드 채움 (gridFilled)"
            description="동심 다각형이 옅은 primary 톤으로 채워짐"
            code={`<RadarChart axes={...} series={[...]} gridFilled />`}
        >
            <Card>
                <RadarChart
                    axes={RADAR_AXES}
                    max={100}
                    series={[RADAR_A]}
                    gridFilled
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="원형 그리드 (gridShape='circle')"
            code={`<RadarChart axes={...} series={[...]} gridShape="circle" />`}
        >
            <Card>
                <RadarChart
                    axes={RADAR_AXES}
                    max={100}
                    series={[RADAR_A]}
                    gridShape="circle"
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="그리드 없음 (gridShape='none')"
            code={`<RadarChart axes={...} series={[...]} gridShape="none" />`}
        >
            <Card>
                <RadarChart
                    axes={RADAR_AXES}
                    max={100}
                    series={[RADAR_A]}
                    gridShape="none"
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="다중 시리즈 + Legend"
            description="primary 단색 톤으로 자동 진하기 차이"
            code={`<RadarChart axes={RADAR_AXES} series={[RADAR_A, RADAR_B]} />`}
        >
            <Card>
                <RadarChart
                    axes={RADAR_AXES}
                    max={100}
                    series={[RADAR_A, RADAR_B]}
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="커스텀 라벨 (axisLabelRender)"
            description="값/단위를 라벨에 함께 표시"
            code={`axisLabelRender={(axis, idx) => (
    <>
        <strong>{RADAR_A.values[idx]}</strong>
        <br />{axis}
    </>
)}`}
        >
            <Card>
                <RadarChart
                    axes={RADAR_AXES}
                    max={100}
                    series={[RADAR_A]}
                    axisLabelRender={(axis, idx) => (
                        <>
                            <strong
                                style={{
                                    fontSize: '13px',
                                    color: 'var(--ds-color-foreground-primary)',
                                }}
                            >
                                {RADAR_A.values[idx]}
                            </strong>
                            <br />
                            {axis}
                        </>
                    )}
                />
            </Card>
        </ComponentPreview>
    </>
)

const RADIAL_DATA = [
    { label: '액션', value: 85 },
    { label: '로맨스', value: 70 },
    { label: '판타지', value: 100 },
    { label: 'SF', value: 49 },
    { label: '일상', value: 62 },
]

export const RadialChartPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="RadialChart"
            description="여러 진행률을 동심원으로. primary 단색 톤 + hover 툴팁. showInlineLabels / showGrid / cap / centerValue 옵션."
        />

        <ComponentPreview
            title="기본 — hover 시 값 확인"
            description="ring 위에 마우스를 올리면 정확한 값이 툴팁으로. legend도 동기화."
            code={`<RadialChart data={data} />`}
        >
            <Card>
                <RadialChart data={RADIAL_DATA} />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="중앙 요약 + 그리드"
            description="showGrid 켜면 회색 트랙이 자동으로 사라지고 dashed 동심원 + 12 spoke가 노출."
            code={`<RadialChart
    data={data}
    showGrid
    centerValue="73%"
    centerLabel="평균"
/>`}
        >
            <Card>
                <RadialChart
                    data={RADIAL_DATA}
                    showGrid
                    centerValue="73%"
                    centerLabel="평균"
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="호 위 라벨 (showInlineLabels)"
            description="라벨이 항상 가로로 표시되어 어떤 각도든 읽기 편함. 두꺼운 ring(thickness ≥ 18) 권장."
            code={`<RadialChart
    data={data}
    showInlineLabels
    thickness={20}
    gap={4}
/>`}
        >
            <Card>
                <RadialChart
                    data={RADIAL_DATA}
                    showInlineLabels
                    thickness={20}
                    gap={4}
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="호 끝 모양 (cap)"
            description="rounded(기본) vs sharp. 데이터 의미에 따라 선택."
            code={`<RadialChart data={data} cap="rounded" />
<RadialChart data={data} cap="sharp" />`}
        >
            <Card>
                <RadialChart data={RADIAL_DATA} cap="rounded" />
            </Card>
            <Card>
                <RadialChart data={RADIAL_DATA} cap="sharp" />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="그리드 + sharp + 중앙"
            description="레퍼런스에서 본 스타일 — grid 위에 sharp 캡 ring + 중앙 텍스트."
            code={`<RadialChart
    data={data}
    showGrid
    cap="sharp"
    centerValue="73%"
    centerLabel="달성률"
/>`}
        >
            <Card>
                <RadialChart
                    data={RADIAL_DATA}
                    showGrid
                    cap="sharp"
                    centerValue="73%"
                    centerLabel="달성률"
                />
            </Card>
        </ComponentPreview>
    </>
)
