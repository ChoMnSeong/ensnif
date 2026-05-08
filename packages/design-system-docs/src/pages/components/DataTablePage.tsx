import {
    Badge,
    DataTable,
    type DataTableColumn,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

type Row = {
    id: number
    title: string
    episode: string
    status: 'on-air' | 'completed' | 'paused'
    viewers: number
    rating: number
    genre: string
}

const ROWS: Row[] = [
    { id: 1, title: '원피스', episode: '1098', status: 'on-air', viewers: 128000, rating: 4.8, genre: '액션' },
    { id: 2, title: '진격의 거인', episode: '87 Final', status: 'completed', viewers: 94000, rating: 4.9, genre: '액션' },
    { id: 3, title: '귀멸의 칼날', episode: '4기', status: 'on-air', viewers: 76000, rating: 4.7, genre: '액션' },
    { id: 4, title: '주술회전', episode: '47', status: 'paused', viewers: 52000, rating: 4.6, genre: '액션' },
    { id: 5, title: '5월 그린', episode: '12', status: 'on-air', viewers: 41000, rating: 4.4, genre: '로맨스' },
    { id: 6, title: '봄날에', episode: '1기 종영', status: 'completed', viewers: 38000, rating: 4.5, genre: '로맨스' },
    { id: 7, title: '판타지 월드', episode: '24', status: 'on-air', viewers: 67000, rating: 4.3, genre: '판타지' },
    { id: 8, title: '마법의 도서관', episode: '8', status: 'paused', viewers: 22000, rating: 4.0, genre: '판타지' },
    { id: 9, title: 'SF 코드', episode: '신작', status: 'on-air', viewers: 84000, rating: 4.6, genre: 'SF' },
    { id: 10, title: '이세계 일기', episode: '3기', status: 'completed', viewers: 58000, rating: 4.2, genre: '판타지' },
    { id: 11, title: '데이즈', episode: '15', status: 'on-air', viewers: 45000, rating: 4.4, genre: '일상' },
    { id: 12, title: '카페 이야기', episode: '12 (완)', status: 'completed', viewers: 33000, rating: 4.3, genre: '일상' },
    { id: 13, title: '스카이 시그널', episode: '5', status: 'paused', viewers: 18000, rating: 3.9, genre: 'SF' },
    { id: 14, title: '흑백 시대', episode: '8', status: 'on-air', viewers: 71000, rating: 4.7, genre: '액션' },
    { id: 15, title: '고요한 별', episode: '1', status: 'on-air', viewers: 12000, rating: 4.1, genre: 'SF' },
]

const statusTone = (s: string) => {
    if (s === 'on-air') return 'success' as const
    if (s === 'completed') return 'info' as const
    return 'warning' as const
}

const formatNumber = (n: number) => n.toLocaleString()

export const DataTablePage = () => {
    const columns: DataTableColumn<Row>[] = [
        {
            id: 'title',
            header: 'Title',
            accessor: (r) => r.title,
            sortable: true,
            cell: (r) => (
                <span style={{ fontWeight: 600 }}>{r.title}</span>
            ),
        },
        {
            id: 'episode',
            header: 'Episode',
            accessor: (r) => r.episode,
            width: 120,
        },
        {
            id: 'genre',
            header: 'Genre',
            accessor: (r) => r.genre,
            sortable: true,
            filter: {
                type: 'select',
                options: [
                    { value: '액션', label: '액션' },
                    { value: '로맨스', label: '로맨스' },
                    { value: '판타지', label: '판타지' },
                    { value: 'SF', label: 'SF' },
                    { value: '일상', label: '일상' },
                ],
            },
        },
        {
            id: 'status',
            header: 'Status',
            accessor: (r) => r.status,
            sortable: true,
            filter: {
                type: 'select',
                options: [
                    { value: 'on-air', label: 'On air' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'paused', label: 'Paused' },
                ],
            },
            cell: (r) => (
                <Badge size="sm" tone={statusTone(r.status)} dot>
                    {r.status}
                </Badge>
            ),
        },
        {
            id: 'rating',
            header: '★',
            accessor: (r) => r.rating,
            sortable: true,
            align: 'right',
            width: 70,
            cell: (r) => (
                <span style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    {r.rating.toFixed(1)}
                </span>
            ),
        },
        {
            id: 'viewers',
            header: 'Viewers',
            accessor: (r) => r.viewers,
            sortable: true,
            align: 'right',
            cell: (r) => (
                <span style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    {formatNumber(r.viewers)}
                </span>
            ),
        },
    ]

    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="DataTable"
                description="검색·정렬·필터·페이지네이션 통합. columns config + data만 넘기면 자동 처리."
            />

            <ComponentPreview
                title="시청 콘텐츠"
                code={`<DataTable
    columns={[...]}
    data={rows}
    pageSize={8}
    showSearch
    searchKeys={['title', 'genre']}
/>`}
            >
                <div style={{ width: '100%' }}>
                    <DataTable
                        columns={columns}
                        data={ROWS}
                        pageSize={8}
                        searchKeys={['title', 'genre']}
                        rowKey={(r) => r.id}
                    />
                </div>
            </ComponentPreview>
        </>
    )
}
