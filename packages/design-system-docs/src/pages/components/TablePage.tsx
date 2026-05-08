import {
    Badge,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const rows = [
    { id: 1, title: '원피스', episode: '1098', status: 'on-air', viewers: '128k' },
    { id: 2, title: '진격의 거인', episode: '87 Final', status: 'completed', viewers: '94k' },
    { id: 3, title: '귀멸의 칼날', episode: '4기', status: 'on-air', viewers: '76k' },
    { id: 4, title: '주술회전', episode: '47', status: 'paused', viewers: '52k' },
]

const statusTone = (s: string) => {
    if (s === 'on-air') return 'success' as const
    if (s === 'completed') return 'info' as const
    return 'warning' as const
}

export const TablePage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Table"
            description="Table / TableHead / TableBody / TableRow / TableHeaderCell / TableCell 컴포지션."
        />

        <ComponentPreview
            title="기본"
            code={`<Table>
    <TableHead>
        <TableRow>
            <TableHeaderCell>Title</TableHeaderCell>
            ...
        </TableRow>
    </TableHead>
    <TableBody>
        {rows.map(r => <TableRow>...</TableRow>)}
    </TableBody>
</Table>`}
        >
            <div style={{ width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Title</TableHeaderCell>
                            <TableHeaderCell>Episode</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                            <TableHeaderCell style={{ textAlign: 'right' }}>
                                Viewers
                            </TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell
                                    style={{
                                        fontWeight: 600,
                                        color: 'var(--ds-color-foreground-primary)',
                                    }}
                                >
                                    {r.title}
                                </TableCell>
                                <TableCell>{r.episode}</TableCell>
                                <TableCell>
                                    <Badge
                                        size="sm"
                                        tone={statusTone(r.status)}
                                        dot
                                    >
                                        {r.status}
                                    </Badge>
                                </TableCell>
                                <TableCell
                                    style={{
                                        textAlign: 'right',
                                        fontFamily:
                                            '"JetBrains Mono", monospace',
                                    }}
                                >
                                    {r.viewers}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </ComponentPreview>
    </>
)
