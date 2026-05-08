import { Tab, TabList, TabPanel, Tabs } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const TabsPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Tabs"
            description="underline / pill 두 가지 variant. controlled 또는 uncontrolled."
        />

        <ComponentPreview
            title="Underline (default)"
            code={`<Tabs defaultValue="overview">
    <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="analytics">Analytics</Tab>
    </TabList>
    <TabPanel value="overview">...</TabPanel>
</Tabs>`}
        >
            <Tabs defaultValue="overview" style={{ width: '100%', maxWidth: '500px' }}>
                <TabList>
                    <Tab value="overview">Overview</Tab>
                    <Tab value="analytics">Analytics</Tab>
                    <Tab value="settings">Settings</Tab>
                </TabList>
                <TabPanel value="overview">
                    <p
                        style={{
                            margin: 0,
                            fontSize: '13px',
                            color: 'var(--ds-color-foreground-secondary)',
                        }}
                    >
                        프로젝트 개요가 여기 표시됩니다.
                    </p>
                </TabPanel>
                <TabPanel value="analytics">
                    <p
                        style={{
                            margin: 0,
                            fontSize: '13px',
                            color: 'var(--ds-color-foreground-secondary)',
                        }}
                    >
                        시청 통계 데이터.
                    </p>
                </TabPanel>
                <TabPanel value="settings">
                    <p
                        style={{
                            margin: 0,
                            fontSize: '13px',
                            color: 'var(--ds-color-foreground-secondary)',
                        }}
                    >
                        계정 설정.
                    </p>
                </TabPanel>
            </Tabs>
        </ComponentPreview>

        <ComponentPreview
            title="Pill"
            code={`<Tabs defaultValue="day" variant="pill">
    <TabList>
        <Tab value="day">일</Tab>
        <Tab value="week">주</Tab>
    </TabList>
    <TabPanel value="day">...</TabPanel>
</Tabs>`}
        >
            <Tabs
                defaultValue="day"
                variant="pill"
                style={{ width: '100%', maxWidth: '500px' }}
            >
                <TabList>
                    <Tab value="day">일</Tab>
                    <Tab value="week">주</Tab>
                    <Tab value="month">월</Tab>
                    <Tab value="year">년</Tab>
                </TabList>
                <TabPanel value="day">일별 데이터</TabPanel>
                <TabPanel value="week">주별 데이터</TabPanel>
                <TabPanel value="month">월별 데이터</TabPanel>
                <TabPanel value="year">연도별 데이터</TabPanel>
            </Tabs>
        </ComponentPreview>
    </>
)
