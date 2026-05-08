import { useState } from 'react'
import {
    Button,
    Calendar,
    CodeBlock,
    CommandPalette,
    DonutChart,
    FormField,
    Gauge,
    HStack,
    IconArrowRight,
    IconCheck,
    IconClose,
    IconError,
    IconInfo,
    IconSearch,
    IconSun,
    Image,
    Input,
    Kbd,
    NavigationMenu,
    PieChart,
    ScrollArea,
    Stack,
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
    Tree,
    Toggle,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const ImagePage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Image"
            description="로딩 placeholder + 에러 fallback. width/height/aspectRatio 지원."
        />
        <ComponentPreview
            title="기본"
            code={`<Image src="..." alt="profile" width={120} height={120} />
<Image src="https://broken-url" alt="broken" width={120} height={120} />`}
        >
            <HStack gap={12}>
                <Image
                    src="https://i.pravatar.cc/200?img=12"
                    alt="profile"
                    width={120}
                    height={120}
                    radius="var(--ds-radius-md)"
                />
                <Image
                    src="https://broken-url"
                    alt="broken"
                    width={120}
                    height={120}
                    radius="var(--ds-radius-md)"
                />
            </HStack>
        </ComponentPreview>
        <ComponentPreview
            title="Aspect ratio"
            code={`<Image src="..." alt="banner" width="100%" aspectRatio={16 / 9} />`}
        >
            <Image
                src="https://picsum.photos/seed/lanime/640/360"
                alt="banner"
                width="100%"
                aspectRatio={16 / 9}
                radius="var(--ds-radius-lg)"
                style={{ maxWidth: '480px', display: 'block' }}
            />
        </ComponentPreview>
    </>
)

export const ToolbarPage = () => {
    const [bold, setBold] = useState(false)
    const [italic, setItalic] = useState(false)
    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Toolbar"
                description="가로 액션 그룹. ToolbarGroup, ToolbarSeparator로 구획화."
            />
            <ComponentPreview
                title="에디터 툴바"
                code={`<Toolbar>
    <ToolbarGroup>
        <Toggle pressed={bold} onPressedChange={setBold}><strong>B</strong></Toggle>
        <Toggle pressed={italic} onPressedChange={setItalic}><em>I</em></Toggle>
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup>
        <Button variant="ghost" size="sm">정렬</Button>
        <Button variant="ghost" size="sm">링크</Button>
    </ToolbarGroup>
    <ToolbarSeparator />
    <Button size="sm">저장</Button>
</Toolbar>`}
            >
                <Toolbar>
                    <ToolbarGroup>
                        <Toggle
                            pressed={bold}
                            onPressedChange={setBold}
                            size="sm"
                        >
                            <strong>B</strong>
                        </Toggle>
                        <Toggle
                            pressed={italic}
                            onPressedChange={setItalic}
                            size="sm"
                        >
                            <em>I</em>
                        </Toggle>
                    </ToolbarGroup>
                    <ToolbarSeparator />
                    <ToolbarGroup>
                        <Button variant="ghost" size="sm">
                            정렬
                        </Button>
                        <Button variant="ghost" size="sm">
                            링크
                        </Button>
                    </ToolbarGroup>
                    <ToolbarSeparator />
                    <Button size="sm">
                        <IconCheck size={14} /> 저장
                    </Button>
                </Toolbar>
            </ComponentPreview>
        </>
    )
}

export const ScrollAreaPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="ScrollArea"
            description="얇은 커스텀 스크롤바 적용. maxHeight, direction 옵션."
        />
        <ComponentPreview
            title="기본"
            code={`<ScrollArea maxHeight={200}>
    {items.map((item) => <div>{item}</div>)}
</ScrollArea>`}
        >
            <ScrollArea
                maxHeight={200}
                style={{
                    width: '320px',
                    border: '1px solid var(--ds-color-border-subtle)',
                    borderRadius: 'var(--ds-radius-md)',
                    padding: '12px',
                }}
            >
                {Array.from({ length: 30 }, (_, i) => (
                    <div
                        key={i}
                        style={{
                            padding: '6px 8px',
                            borderBottom:
                                '1px solid var(--ds-color-border-subtle)',
                            fontSize: '13px',
                        }}
                    >
                        목록 항목 {i + 1}
                    </div>
                ))}
            </ScrollArea>
        </ComponentPreview>
    </>
)

export const FormFieldPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="FormField / Form"
            description="Label + Input + 설명/에러를 한 번에. 폼 보일러플레이트 감소."
        />
        <ComponentPreview
            title="기본"
            code={`<FormField label="이메일" required description="가입 시 사용한 주소">
    <Input fullWidth />
</FormField>`}
        >
            <Stack
                gap={14}
                style={{ width: '100%', maxWidth: '420px' }}
            >
                <FormField
                    label="이메일"
                    htmlFor="email"
                    required
                    description="가입 시 사용한 주소"
                >
                    <Input id="email" type="email" fullWidth />
                </FormField>
                <FormField
                    label="비밀번호"
                    htmlFor="pwd"
                    required
                    error="8자 이상 입력해주세요"
                >
                    <Input id="pwd" type="password" invalid fullWidth />
                </FormField>
                <FormField label="별명" htmlFor="nick" hint="공개됩니다">
                    <Input id="nick" fullWidth />
                </FormField>
            </Stack>
        </ComponentPreview>
    </>
)

const PIE_DATA = [
    { label: '액션', value: 38 },
    { label: '로맨스', value: 24 },
    { label: '판타지', value: 18 },
    { label: 'SF', value: 12 },
    { label: '기타', value: 8 },
]

export const PiePage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="PieChart / DonutChart"
            description="SVG 기반 원형 차트. legend 자동, custom color 지원."
        />
        <ComponentPreview
            title="PieChart"
            code={`<PieChart data={data} size={180} />`}
        >
            <PieChart data={PIE_DATA} size={180} />
        </ComponentPreview>
        <ComponentPreview
            title="DonutChart with center"
            code={`<DonutChart
    data={data}
    size={200}
    thickness={32}
    centerValue="100%"
    centerLabel="시청 비중"
/>`}
        >
            <DonutChart
                data={PIE_DATA}
                size={200}
                thickness={32}
                centerValue="100%"
                centerLabel="시청 비중"
            />
        </ComponentPreview>
    </>
)

export const GaugePage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Gauge"
            description="원형 진행률. value/max, 사이즈, 두께, 색상."
        />
        <ComponentPreview
            title="기본"
            code={`<Gauge value={62} label="달성" />
<Gauge value={84} label="완료" color="var(--ds-color-state-success)" />`}
        >
            <HStack gap={20}>
                <Gauge value={62} label="달성" />
                <Gauge
                    value={84}
                    label="완료"
                    color="var(--ds-color-state-success)"
                />
                <Gauge
                    value={28}
                    label="남음"
                    color="var(--ds-color-state-warning)"
                />
            </HStack>
        </ComponentPreview>
    </>
)

export const CalendarPage = () => {
    const [d, setD] = useState<string | undefined>('2026-05-08')
    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Calendar"
                description="full month view. markedDates 점 표시, min/maxDate 비활성, weekStartsOn."
            />
            <ComponentPreview
                title="기본"
                code={`<Calendar
    value={d}
    onChange={setD}
    weekStartsOn={1}
    markedDates={['2026-05-10', '2026-05-15', '2026-05-20']}
/>`}
            >
                <Calendar
                    value={d}
                    onChange={setD}
                    weekStartsOn={1}
                    markedDates={['2026-05-10', '2026-05-15', '2026-05-20']}
                />
            </ComponentPreview>
        </>
    )
}

const TREE_DATA = [
    {
        id: 'src',
        label: 'src',
        children: [
            {
                id: 'components',
                label: 'components',
                children: [
                    { id: 'Button.tsx', label: 'Button.tsx' },
                    { id: 'Input.tsx', label: 'Input.tsx' },
                    { id: 'Card.tsx', label: 'Card.tsx' },
                ],
            },
            {
                id: 'pages',
                label: 'pages',
                children: [
                    { id: 'Home.tsx', label: 'Home.tsx' },
                    { id: 'About.tsx', label: 'About.tsx' },
                ],
            },
            { id: 'index.ts', label: 'index.ts' },
        ],
    },
    { id: 'package.json', label: 'package.json' },
]

export const TreePage = () => {
    const [selected, setSelected] = useState<string>('Input.tsx')
    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Tree"
                description="계층 트리뷰. 폴더/파일 같은 중첩 구조 표시."
            />
            <ComponentPreview
                title="파일 트리"
                code={`<Tree
    data={treeData}
    defaultExpanded={['src', 'components']}
    selectedId={selected}
    onSelect={setSelected}
/>`}
            >
                <Tree
                    data={TREE_DATA}
                    defaultExpanded={['src', 'components']}
                    selectedId={selected}
                    onSelect={setSelected}
                    style={{
                        width: '280px',
                        padding: '8px',
                        background: 'var(--ds-color-background-card)',
                        border: '1px solid var(--ds-color-border-subtle)',
                        borderRadius: 'var(--ds-radius-md)',
                    }}
                />
            </ComponentPreview>
        </>
    )
}

export const CommandPalettePage = () => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="CommandPalette"
                description="⌘K 검색 메뉴. group 묶음, 키워드, 단축키 표시 지원."
            />
            <ComponentPreview
                title="기본"
                code={`<CommandPalette open={open} onClose={...} items={items} />`}
            >
                <Stack gap={8} align="center">
                    <Button onClick={() => setOpen(true)}>
                        명령 열기 <Kbd size="sm">⌘</Kbd>
                        <Kbd size="sm">K</Kbd>
                    </Button>
                </Stack>
                <CommandPalette
                    open={open}
                    onClose={() => setOpen(false)}
                    items={[
                        {
                            id: 'new',
                            label: '새 컬렉션',
                            description: '내 라이브러리 추가',
                            group: '액션',
                            shortcut: '⌘N',
                            icon: <IconArrowRight size={14} />,
                            onSelect: () => alert('새 컬렉션'),
                        },
                        {
                            id: 'search',
                            label: '검색',
                            group: '액션',
                            shortcut: '⌘F',
                            icon: <IconSearch size={14} />,
                            onSelect: () => alert('검색'),
                        },
                        {
                            id: 'theme',
                            label: '다크 모드 전환',
                            group: '설정',
                            icon: <IconSun size={14} />,
                            onSelect: () => alert('테마'),
                        },
                        {
                            id: 'help',
                            label: '도움말',
                            group: '설정',
                            icon: <IconInfo size={14} />,
                            onSelect: () => alert('help'),
                        },
                        {
                            id: 'logout',
                            label: '로그아웃',
                            group: '계정',
                            icon: <IconClose size={14} />,
                            onSelect: () => alert('logout'),
                        },
                    ]}
                />
            </ComponentPreview>
        </>
    )
}

export const NavigationMenuPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="NavigationMenu"
            description="앱 사이드바용 계층 네비. 아이콘, 배지, 펼침 지원."
        />
        <ComponentPreview
            title="기본"
            code={`<NavigationMenu
    activeId="trending"
    defaultExpanded={['library']}
    items={[
        { id: 'home', label: '홈', icon: <IconHome /> },
        {
            id: 'library',
            label: '라이브러리',
            children: [
                { id: 'all', label: '전체' },
                { id: 'fav', label: '즐겨찾기', badge: '12' },
            ],
        },
        { id: 'noti', label: '알림', badge: '3' },
    ]}
/>`}
        >
            <NavigationMenu
                activeId="trending"
                defaultExpanded={['library']}
                items={[
                    {
                        id: 'home',
                        label: '홈',
                        icon: <IconArrowRight size={14} />,
                    },
                    {
                        id: 'library',
                        label: '라이브러리',
                        icon: <IconSearch size={14} />,
                        children: [
                            { id: 'all', label: '전체' },
                            { id: 'fav', label: '즐겨찾기', badge: '12' },
                            { id: 'trending', label: '인기' },
                        ],
                    },
                    {
                        id: 'noti',
                        label: '알림',
                        icon: <IconError size={14} />,
                        badge: '3',
                    },
                ]}
                style={{ width: '240px' }}
            />
        </ComponentPreview>
    </>
)
